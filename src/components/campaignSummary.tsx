import { useEffect, useState } from "react";

function CampaignSummary({ campaignId }: { campaignId: string }) {
  const [summary, setSummary] = useState<string>("Loading summary...");

  useEffect(() => {
    fetch(`/api/campaigns/${campaignId}/summary`)
      .then(res => res.json())
      .then(data => setSummary(data.summary || "No summary available."))
      .catch(() => setSummary("Failed to load summary."));
  }, [campaignId]);

  // Function to parse and format the summary sections
  const formatSummary = (text: string) => {
    const sections: { [key: string]: string[] } = {
      title: [],
      findings: [],
      wentWell: [],
      improvement: []
    };

    const lines = text.split('\n');
    let currentSection = 'title';

    lines.forEach(line => {
      line = line.trim();
      if (line.includes('Key Findings:')) {
        currentSection = 'findings';
      } else if (line.includes('What Went Well:')) {
        currentSection = 'wentWell';
      } else if (line.includes('Areas for Improvement:')) {
        currentSection = 'improvement';
      } else if (line) {
        sections[currentSection].push(line.replace(/^\*\*|\*\*$/g, '').replace(/^- /, ''));
      }
    });

    return sections;
  };

  const sections = formatSummary(summary);

  return (
    <div className="my-6 p-6 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-1 bg-primary rounded-full" />
        <h3 className="text-xl font-semibold">AI Campaign Summary</h3>
      </div>

      <div className="space-y-6">
        {/* Campaign Title */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-primary mb-2">
            {sections.title[0]?.replace('Campaign Performance Summary: ', '').replace(/"/g, '')}
          </h4>
        </div>

        {/* Key Findings */}
        <div className="space-y-2">
          <h5 className="font-semibold text-muted-foreground flex items-center gap-2">
            <span className="h-1 w-1 bg-primary rounded-full" />
            Key Findings
          </h5>
          <div className="pl-4 border-l-2 border-primary/20">
            {sections.findings.map((finding, i) => (
              <p key={i} className="text-sm mb-2 text-muted-foreground">
                {finding}
              </p>
            ))}
          </div>
        </div>

        {/* What Went Well */}
        <div className="space-y-2">
          <h5 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
            <span className="h-1 w-1 bg-green-500 rounded-full" />
            What Went Well
          </h5>
          <div className="pl-4 border-l-2 border-green-500/20">
            <ul className="space-y-1">
              {sections.wentWell.map((point, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="space-y-2">
          <h5 className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span className="h-1 w-1 bg-amber-500 rounded-full" />
            Areas for Improvement
          </h5>
          <div className="pl-4 border-l-2 border-amber-500/20">
            <ul className="space-y-1">
              {sections.improvement.map((point, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignSummary