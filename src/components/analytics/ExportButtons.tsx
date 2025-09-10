import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

interface ExportProps {
  campaignData: {
    name: string;
    status: string;
    metrics: {
      delivered: number;
      failed: number;
      pending: number;
      total: number;
    };
    timeline: Array<{
      date: string;
      delivered: number;
      failed: number;
    }>;
  };
}

const PDFReport = ({ data }: { data: ExportProps["campaignData"] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Campaign Report: {data.name}</Text>
        <Text style={styles.text}>Status: {data.status}</Text>
        <Text style={styles.text}>Total Messages: {data.metrics.total}</Text>
        <Text style={styles.text}>Delivered: {data.metrics.delivered}</Text>
        <Text style={styles.text}>Failed: {data.metrics.failed}</Text>
        <Text style={styles.text}>Pending: {data.metrics.pending}</Text>
      </View>
    </Page>
  </Document>
);

export function ExportButtons({ campaignData }: ExportProps) {
  const csvData = [
    ["Date", "Delivered", "Failed"],
    ...campaignData.timeline.map(item => [
      item.date,
      item.delivered,
      item.failed,
    ]),
  ];

  return (
    <div className="flex gap-4">
      <CSVLink
        data={csvData}
        filename={`${campaignData.name}-report.csv`}
        className="inline-block"
      >
        <Button variant="outline">Export CSV</Button>
      </CSVLink>

      <PDFDownloadLink
        document={<PDFReport data={campaignData} />}
        fileName={`${campaignData.name}-report.pdf`}
      >
        {({ loading }) => (
          <Button variant="outline" disabled={loading}>
            {loading ? "Loading..." : "Export PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
