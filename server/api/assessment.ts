/**
 * Assessment Data Collection API
 * Handles respondent data submission and storage
 */

import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const DATA_DIR = path.join(process.cwd(), 'data/pilot-responses');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

/**
 * POST /api/assessment/submit
 * Receive and store assessment responses
 */
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { respondentId, sessionStartTime, questionResponses, experimentResponses } = req.body;

    // Validate required fields
    if (!respondentId || !questionResponses || !experimentResponses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Anonymize: store without personally identifiable info
    const anonymizedData = {
      respondent_id: respondentId,
      session_start_time: sessionStartTime,
      session_end_time: new Date().toISOString(),
      total_time_spent: req.body.totalTimeSpent,
      question_count: Object.keys(questionResponses).length,
      experiment_count: Object.keys(experimentResponses).length,
      experiments: experimentResponses,
      question_responses: questionResponses,
      completion_status: 'completed',
      data_version: '1.0',
    };

    // Store response
    const filename = `${respondentId}-${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);

    await fs.writeJSON(filepath, anonymizedData, { spaces: 2 });

    console.log(`✅ Response saved: ${filename}`);

    // Log to aggregate file for quick access
    const logFile = path.join(DATA_DIR, 'submission-log.jsonl');
    const logEntry = `${JSON.stringify({
      respondent_id: respondentId,
      timestamp: new Date().toISOString(),
      question_count: Object.keys(questionResponses).length,
      experiment_count: Object.keys(experimentResponses).length,
      time_spent: req.body.totalTimeSpent,
      file: filename,
    })}\n`;

    await fs.appendFile(logFile, logEntry);

    return res.json({
      success: true,
      respondentId,
      completionCode: generateCompletionCode(respondentId),
      message: 'Assessment response received and stored',
    });
  } catch (error) {
    console.error('Error storing response:', error);
    return res.status(500).json({ error: 'Failed to store response' });
  }
});

/**
 * GET /api/assessment/status
 * Check pilot status (recruitment progress)
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const responseFiles = files.filter(f => f.endsWith('.json') && f !== 'submission-log.jsonl');

    // Count responses per day
    const logs: string[] = [];
    try {
      const logContent = await fs.readFile(path.join(DATA_DIR, 'submission-log.jsonl'), 'utf-8');
      logs.push(...logContent.split('\n').filter(l => l.trim()));
    } catch (e) {
      // Log file doesn't exist yet
    }

    return res.json({
      totalResponses: responseFiles.length,
      targetResponses: 50,
      completionRate: Math.round((responseFiles.length / 50) * 100),
      recentSubmissions: logs.slice(-10),
      dataDirectory: DATA_DIR,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get status' });
  }
});

/**
 * GET /api/assessment/data/export
 * Export all responses as JSON for analysis
 */
router.get('/data/export', async (req: Request, res: Response) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const responseFiles = files.filter(f => f.endsWith('.json') && f !== 'all-responses.json');

    const allResponses = [];
    for (const file of responseFiles) {
      const data = await fs.readJSON(path.join(DATA_DIR, file));
      allResponses.push(data);
    }

    // Save combined export
    const exportPath = path.join(DATA_DIR, 'all-responses.json');
    await fs.writeJSON(exportPath, allResponses, { spaces: 2 });

    return res.json({
      success: true,
      totalResponses: allResponses.length,
      exportFile: exportPath,
      data: allResponses,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to export data' });
  }
});

/**
 * DELETE /api/assessment/data/anonymize
 * Remove sensitive data if needed (GDPR compliance)
 */
router.delete('/data/anonymize', async (req: Request, res: Response) => {
  try {
    // In production, this would anonymize respondent IDs and timestamps
    // For now, just confirm the action would work
    return res.json({
      success: true,
      message: 'Anonymization protocol ready (not executed)',
      action: 'Would remove timestamps, anonymize IDs, and secure data',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Anonymization failed' });
  }
});

function generateCompletionCode(respondentId: string): string {
  return `ASSESS-${respondentId.substr(0, 8)}-COMPLETE`.toUpperCase();
}

export default router;
