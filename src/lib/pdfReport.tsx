import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { axes } from '../data/axes'
import type { AxisVector, ProfileMatch } from './scoring'
import type { ProfileReportContent } from '../data/types'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 22, marginBottom: 12 },
  heading: { fontSize: 16, marginTop: 16, marginBottom: 8 },
  paragraph: { marginBottom: 8, lineHeight: 1.4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
})

interface ReportDocumentProps {
  combined: AxisVector
  t1Scaled: AxisVector
  t2Scaled: AxisVector
  topMatches: ProfileMatch[]
  profileReports: Record<string, ProfileReportContent>
}

export function ReportDocument({ combined, t1Scaled, t2Scaled, topMatches, profileReports }: ReportDocumentProps) {
  const top = topMatches[0]
  const runnerUps = topMatches.slice(1, 3)
  const topContent = profileReports[top.profile.id]

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Your TIAM-112 Report</Text>
        <Text style={styles.paragraph}>Closest match: {top.profile.name}</Text>
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Methodology &amp; Disclaimer</Text>
        <Text style={styles.paragraph}>
          This report is a self-reflection tool, not a validated scientific instrument. It has not
          been through independent test-retest reliability studies, factor analysis, or peer
          review. The named thinkers and books in this report describe documented public work only
          — they are not claims about those people's personal views, quiz results, or endorsement
          of this report's characterization of any archetype.
        </Text>
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Your Coordinates</Text>
        {axes.map((axis) => (
          <View key={axis.id} style={styles.row}>
            <Text>{axis.name}</Text>
            <Text>
              Right Now: {t1Scaled[axis.id].toFixed(2)} | Looking Ahead: {t2Scaled[axis.id].toFixed(2)} | Combined: {combined[axis.id].toFixed(2)}
            </Text>
          </View>
        ))}
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Your Top Match: {top.profile.name}</Text>
        {topContent.extendedNarrative.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}
        <Text style={styles.heading}>Thinkers</Text>
        {topContent.thinkers.map((thinker) => (
          <Text key={thinker.name} style={styles.paragraph}>
            {thinker.name} ({thinker.bio}): {thinker.connection}
          </Text>
        ))}
        <Text style={styles.heading}>Further Reading</Text>
        {topContent.furtherReading.map((item) => (
          <Text key={item.title} style={styles.paragraph}>
            {item.title}, {item.author} — {item.note}
          </Text>
        ))}
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Runner-Up Matches</Text>
        {runnerUps.map((match) => (
          <View key={match.profile.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, marginBottom: 4 }}>{match.profile.name}</Text>
            <Text style={styles.paragraph}>{match.profile.summary}</Text>
            <Text>Distance: {match.distance.toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.heading}>Further Reading and Next Steps</Text>
        {topMatches.map((match) => {
          const content = profileReports[match.profile.id]
          return (
            <View key={match.profile.id} style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 4 }}>{match.profile.name}</Text>
              {content.nextSteps.map((step, index) => (
                <Text key={index} style={styles.paragraph}>- {step}</Text>
              ))}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}
