import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Section } from "@/lib/demande-orientation-psy/sections";
import { formatDatetimeFr } from "@/lib/demande-orientation-psy/format";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    paddingTop: 32,
    paddingBottom: 60,
    paddingLeft: 36,
    paddingRight: 36,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
  },
  sectionBlock: {
    marginTop: 10,
  },
  sectionHeader: {
    backgroundColor: "#1e3a5f",
    color: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  labelCell: {
    flexBasis: "38%",
    flexGrow: 0,
    flexShrink: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 16,
    backgroundColor: "#f9fafb",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  valueCell: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 8,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 10,
    marginTop: 16,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    fontSize: 8,
    color: "#6b7280",
  },
});

interface Props {
  sections: Section[];
  generatedAt: string;
  originPath?: string;
}

export function OrientationPsyPdf({ sections, generatedAt }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{"Demande d’orientation IDE Psy"}</Text>
          <Text style={styles.subtitle}>
            {`Généré le ${formatDatetimeFr(generatedAt)}`}
          </Text>
        </View>

        {sections.length === 0 ? (
          <Text style={styles.emptyText}>{"Aucun champ renseigné"}</Text>
        ) : (
          sections.map((section) => (
            <View key={section.title} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text>{section.title}</Text>
              </View>
              {section.rows.map((row, i) => (
                <View key={`${section.title}-${i}`} style={styles.row}>
                  <View style={styles.labelCell}>
                    <Text>{row.label}</Text>
                  </View>
                  <View style={styles.valueCell}>
                    <Text>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

        <View style={styles.footer}>
          <Text>
            {"Données de santé : ce document contient des informations sensibles. Merci d’appliquer vos règles de confidentialité et de conservation."}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
