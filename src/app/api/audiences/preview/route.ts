/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/audiences/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import CustomerModel from '@/models/customer';
import { AudienceRuleSet, IRuleCondition, IRuleGroup } from '@/models/campaign'; 
import { z } from 'zod';
import mongoose from 'mongoose';
import { baseRuleGroupSchema } from '@/lib/validations';


type RuleGroupInput = z.infer<typeof baseRuleGroupSchema> & {
  groups?: RuleGroupInput[];
};
const ruleGroupSchema: z.ZodType<RuleGroupInput> = baseRuleGroupSchema.extend({
  groups: z.lazy(() => z.array(ruleGroupSchema)).optional(),
});

const audienceRuleSetSchema: z.ZodType<AudienceRuleSet> = ruleGroupSchema;


// Helper function to build MongoDB query from rules
const buildMongoQuery = (ruleSet: AudienceRuleSet): mongoose.FilterQuery<any> => {
  const parseGroup = (group: IRuleGroup): mongoose.FilterQuery<any> => {
    const mongoConditions: mongoose.FilterQuery<any>[] = [];

    // Process direct conditions in the group
    group.conditions.forEach(condition => {
      mongoConditions.push(parseCondition(condition));
    });

    // Process nested groups
    if (group.groups && group.groups.length > 0) {
      group.groups.forEach(subGroup => {
        mongoConditions.push(parseGroup(subGroup));
      });
    }
    
    if (mongoConditions.length === 0) return {};
    if (mongoConditions.length === 1) return mongoConditions[0];

    return group.logicalOperator === 'AND' ? { $and: mongoConditions } : { $or: mongoConditions };
  };

  const parseCondition = (condition: IRuleCondition): mongoose.FilterQuery<any> => {
    const { field, operator, value } = condition;
    let queryValue = value;
    let mongoOperator: string;

    // Handle date operations
    if (field === 'lastActiveDate' && (operator === 'OLDER_THAN_DAYS' || operator === 'IN_LAST_DAYS')) {
      const days = Number(value);
      if (isNaN(days)) throw new Error(`Invalid number of days for ${operator}: ${value}`);
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      
      if (operator === 'OLDER_THAN_DAYS') { // e.g., older than 90 days means lastActiveDate < (today - 90 days)
        return { [field]: { $lt: dateThreshold } };
      } else { // IN_LAST_DAYS e.g. in last 90 days means lastActiveDate >= (today - 90 days)
        return { [field]: { $gte: dateThreshold } };
      }
    } else if (condition.dataType === 'date') {
        queryValue = new Date(value as string);
        if (isNaN(queryValue.getTime())) throw new Error(`Invalid date value for ${field}: ${value}`);
    }


    switch (operator) {
      case 'EQUALS': mongoOperator = '$eq'; break;
      case 'NOT_EQUALS': mongoOperator = '$ne'; break;
      case 'GREATER_THAN': mongoOperator = '$gt'; break;
      case 'LESS_THAN': mongoOperator = '$lt'; break;
      case 'CONTAINS': mongoOperator = '$regex'; queryValue = new RegExp(String(value), 'i').toString(); break; // Case-insensitive contains
      case 'STARTS_WITH': mongoOperator = '$regex'; queryValue = new RegExp('^' + String(value), 'i').toString(); break;
      case 'ENDS_WITH': mongoOperator = '$regex'; queryValue = new RegExp(String(value) + '$', 'i').toString(); break;
      default: throw new Error(`Unsupported operator: ${operator}`);
    }
    return { [field]: { [mongoOperator]: queryValue } };
  };
  
  return parseGroup(ruleSet);
};


export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = audienceRuleSetSchema.safeParse(body.rules);
    if (!validation.success) {
      return NextResponse.json({ message: "Invalid rule structure", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const audienceRules = validation.data as AudienceRuleSet; // Cast to ensure type after validation
    if (!audienceRules || (audienceRules.conditions.length === 0 && (!audienceRules.groups || audienceRules.groups.length === 0))) {
        return NextResponse.json({ audienceSize: 0, message: "No rules provided to preview." }, { status: 200 });
    }

    console.log('Received audience rules:', JSON.stringify(audienceRules, null, 2));
    
    const mongoQuery = buildMongoQuery(audienceRules);
    console.log('Generated MongoDB query:', JSON.stringify(mongoQuery, null, 2));
    
    // If the query is empty (e.g. no valid rules), count all customers.
    if (Object.keys(mongoQuery).length === 0) {
         const allCustomers = await CustomerModel.countDocuments({});
         return NextResponse.json({ 
           audienceSize: allCustomers, 
           query: {},
           totalCustomers: allCustomers,
           message: "No filters applied - showing all customers count." 
         }, { status: 200 });
    }

    // Get total customers for reference
    const totalCustomers = await CustomerModel.countDocuments({});
    
    // Get matching customers count
    const audienceSize = await CustomerModel.countDocuments(mongoQuery);
    
    // Get a sample of matching customers (limit to 5)
    const sampleCustomers = await CustomerModel
      .find(mongoQuery)
      .limit(5)
      .select('name email totalSpends visitCount lastActiveDate');

    return NextResponse.json({ 
      audienceSize, 
      query: mongoQuery,
      totalCustomers,
      sampleCustomers: sampleCustomers.map(c => c.toObject()),
      debug: {
        receivedRules: audienceRules,
        generatedQuery: mongoQuery,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error previewing audience:", error);
    return NextResponse.json({ message: "Failed to preview audience", error: error.message }, { status: 500 });
  }
}
