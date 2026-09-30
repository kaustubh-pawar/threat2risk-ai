"use client";

export interface ReportTargetItem {
  id: string;
  name?: string;
  event_type?: string;
  severity?: string;
  user?: string;
  asset?: string;
  host?: string;
  source?: string;
  source_ip?: string;
  destination_ip?: string;
  raw_log?: string;
  timestamp?: string;
}

export function generateReportPDF(
  type: 'technical' | 'executive' | 'grc' | 'threat',
  item?: ReportTargetItem
) {
  const eventId = item?.id || 'INC-2026-0042';
  const eventName = item?.name || item?.event_type?.replace(/_/g, ' ').toUpperCase() || 'Compromised admin account & database exfiltration';
  const severity = (item?.severity || 'critical').toUpperCase();
  const timestamp = item?.timestamp || '10 Aug 2026, 10:01 UTC';
  const asset = item?.asset || item?.host || 'AUTH-SRV-01 / FIN-DB-01';
  const user = item?.user || 'admin01';
  const rawLog = item?.raw_log || 'Multiple failed login attempts followed by privileged database access and large outbound transfer.';
  const sourceIp = item?.source_ip || '10.10.10.5';

  const riskScore = severity === 'CRITICAL' ? 91 : severity === 'HIGH' ? 78 : severity === 'MEDIUM' ? 55 : 30;
  const bannerBg = severity === 'CRITICAL' ? '#c53030' : severity === 'HIGH' ? '#dd6b20' : severity === 'MEDIUM' ? '#3182ce' : '#38a169';

  const getHTML = () => {
    switch (type) {
      case 'technical':
        return `
          <div class="header-badge"><span class="badge-pill">THREAT2RISK AI</span></div>
          <div class="report-title">Technical Event Report</div>
          <div class="report-meta">${eventId} | Detected ${timestamp} | Grounded in event telemetry</div>
          <div class="banner-critical" style="background: ${bannerBg};">Severity: ${severity} · Risk score: ${riskScore}/100</div>
          <div class="divider"></div>

          <div class="section-title">Event Overview</div>
          <p class="narrative-p"><strong>Target Entity:</strong> ${user} | <strong>Asset:</strong> ${asset} | <strong>Source IP:</strong> ${sourceIp}</p>
          <p class="narrative-p"><strong>Event Description:</strong> ${eventName}</p>

          <div class="section-title">AI-Generated Analysis Narrative</div>
          <p class="narrative-p">At ${timestamp}, telemetry recorded: "${rawLog}". Analysis confirms activity originating from ${user} on asset ${asset}. Signal correlation indicates a ${severity.toLowerCase()} priority security event requiring technical containment.</p>

          <div class="section-title">Event Telemetry Details</div>
          <table>
            <thead>
              <tr><th>Attribute</th><th>Observed Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Event ID</td><td>${eventId}</td></tr>
              <tr><td>Timestamp</td><td>${timestamp}</td></tr>
              <tr><td>Event Action</td><td>${eventName}</td></tr>
              <tr><td>User Identity</td><td>${user}</td></tr>
              <tr><td>Target Asset</td><td>${asset}</td></tr>
              <tr><td>Source IP Address</td><td>${sourceIp}</td></tr>
              <tr><td>Raw Log Payload</td><td><code>${rawLog}</code></td></tr>
            </tbody>
          </table>

          <div class="section-title">Associated Asset Profile</div>
          <table>
            <thead>
              <tr><th>Asset Name</th><th>Criticality Level</th><th>Component Type</th></tr>
            </thead>
            <tbody>
              <tr><td>${asset}</td><td>${severity === 'CRITICAL' || severity === 'HIGH' ? 'Critical' : 'Medium'}</td><td>Security Gateway / Host Server</td></tr>
            </tbody>
          </table>
        `;

      case 'grc':
        return `
          <div class="header-badge"><span class="badge-pill">THREAT2RISK AI</span></div>
          <div class="report-title">Risk & GRC Event Report</div>
          <div class="report-meta">${eventId} | Detected ${timestamp} | Grounded in event telemetry</div>
          <div class="banner-critical" style="background: ${bannerBg};">Severity: ${severity} · Risk score: ${riskScore}/100</div>
          <div class="divider"></div>

          <div class="section-title">Risk & Compliance Summary</div>
          <p class="narrative-p">Event <strong>${eventId}</strong> scored ${riskScore}/100 (${severity}). The score reflects threat activity targeting ${asset} by user <strong>${user}</strong>.</p>

          <div class="section-title">Risk Factors Breakdown</div>
          <table>
            <thead>
              <tr><th>Risk Factor</th><th>Score</th><th>Reasoning</th></tr>
            </thead>
            <tbody>
              <tr><td>Asset Criticality</td><td>${riskScore + 4 > 99 ? 99 : riskScore + 4}</td><td>Impact on primary production host ${asset}.</td></tr>
              <tr><td>User Privilege Level</td><td>${riskScore - 2}</td><td>Elevated rights associated with ${user}.</td></tr>
              <tr><td>Detection Severity</td><td>${riskScore}</td><td>Rule trigger: ${eventName}.</td></tr>
            </tbody>
          </table>

          <div class="section-title">Compliance Framework Alignment</div>
          <p class="narrative-p">
            <strong>NIST CSF:</strong> Protect - Access Control (PR.AC); Detect - Anomalies (DE.AE)<br/>
            <strong>ISO 27001:</strong> A.9 Access Control; A.12 Operations Security
          </p>

          <div class="section-title">Identified Control Deficiencies</div>
          <div class="gap-callout">
            Event ${eventId}: Insufficient automated challenge policies for user ${user} on asset ${asset}.
          </div>

          <div class="section-title">Recommended Remediation Steps</div>
          <ol>
            <li>Verify and rotate credentials for user ${user}</li>
            <li>Enforce multi-factor authentication on host ${asset}</li>
            <li>Restrict network traffic originating from IP ${sourceIp}</li>
            <li>Audit security log entries around ${timestamp}</li>
          </ol>
        `;

      case 'executive':
        return `
          <div class="header-badge"><span class="badge-pill">THREAT2RISK AI</span></div>
          <div class="report-title">Executive Summary Report</div>
          <div class="report-meta">${eventId} | Detected ${timestamp} | Grounded in event telemetry</div>
          <div class="banner-critical" style="background: ${bannerBg};">Severity: ${severity} · Risk score: ${riskScore}/100</div>
          <div class="divider"></div>

          <div class="section-title">Executive Overview</div>
          <p class="narrative-p">Security telemetry identified a ${severity.toLowerCase()} security event (ID: ${eventId}) involving account <strong>${user}</strong> on infrastructure asset <strong>${asset}</strong>.</p>

          <div class="section-title">Business Impact</div>
          <p class="narrative-p">Activity "${eventName}" poses an operational risk to organization assets. Potential exposure is localized to ${asset} and monitored network pathways.</p>

          <div class="section-title">Severity Assessment</div>
          <p class="narrative-p">Assessed at ${severity} severity with a quantified risk score of ${riskScore}/100. Prompt containment prevents further lateral escalation.</p>

          <div class="section-title">Immediate Action Items</div>
          <ul>
            <li>Isolate affected host ${asset} from critical segment</li>
            <li>Deactivate user account ${user} pending analyst review</li>
            <li>Apply real-time firewall filtering for source IP ${sourceIp}</li>
          </ul>

          <div class="section-title">Executive Bottom Line</div>
          <div class="callout-box">
            Event ${eventId} has been flagged for active investigation. Security controls are containing potential blast radius.
          </div>
        `;

      case 'threat':
        return `
          <div class="header-badge"><span class="badge-pill">THREAT2RISK AI</span></div>
          <div class="report-title">Threat Intelligence Report</div>
          <div class="report-meta">${eventId} | Detected ${timestamp} | Grounded in event telemetry</div>
          <div class="banner-critical" style="background: ${bannerBg};">Severity: ${severity} · Risk score: ${riskScore}/100</div>
          <div class="divider"></div>

          <div class="section-title">Threat Intelligence Summary</div>
          <p class="narrative-p">Adversary activity detected: <strong>${eventName}</strong>. Event ${eventId} exhibits indicators consistent with unauthorized access maneuvers against ${asset}.</p>

          <div class="section-title">Indicators of Compromise (IOCs)</div>
          <table>
            <thead>
              <tr><th>Indicator</th><th>Type</th><th>Classification</th></tr>
            </thead>
            <tbody>
              <tr><td>${sourceIp}</td><td>Source IP</td><td>Originating Network Node</td></tr>
              <tr><td>${user}</td><td>User Entity</td><td>Targeted Account Identifier</td></tr>
              <tr><td>${asset}</td><td>Host Name</td><td>Affected Asset Endpoint</td></tr>
            </tbody>
          </table>

          <div class="section-title">Threat Chain Context</div>
          <p class="narrative-p">Event ${eventId} occurred at ${timestamp}. Raw log: <code>${rawLog}</code>. Correlated with threat pattern ${eventName}.</p>

          <div class="section-title">Mitigation & Countermeasures</div>
          <ol>
            <li>Block external IP ${sourceIp} at border perimeter</li>
            <li>Revoke authorization tokens for ${user}</li>
            <li>Enable EDR deep inspection on ${asset}</li>
          </ol>
        `;

      default:
        return '';
    }
  };

  const fullDocument = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Threat2Risk AI Report - ${eventId} (${type.toUpperCase()})</title>
      <style>
        @page { size: A4; margin: 15mm; }
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          background: #ffffff;
          margin: 0;
          padding: 28px 36px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .header-badge { text-align: center; margin-bottom: 16px; }
        .badge-pill {
          background: #0f172a;
          color: #ffffff;
          padding: 6px 24px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          display: inline-block;
          font-family: monospace;
          border-radius: 2px;
        }
        .report-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 16px 0 4px 0;
        }
        .report-meta {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .banner-critical {
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          padding: 8px 14px;
          margin-bottom: 16px;
          border-radius: 2px;
        }
        .divider {
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 20px 0 8px 0;
        }
        .narrative-p {
          font-size: 12px;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        th {
          background: #0f172a;
          color: #ffffff;
          font-weight: 700;
          text-align: left;
          padding: 8px 12px;
        }
        td {
          padding: 8px 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        tr:nth-child(even) td {
          background-color: #f8fafc;
        }
        .gap-callout {
          background: #fff5f5;
          border: 1px solid #feb2b2;
          padding: 12px 16px;
          border-radius: 4px;
          color: #2d3748;
          font-size: 12px;
          margin: 16px 0;
        }
        .callout-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 14px 18px;
          border-radius: 4px;
          color: #334155;
          font-size: 12px;
          margin: 20px 0;
          line-height: 1.6;
        }
        ul, ol {
          font-size: 12px;
          color: #334155;
          line-height: 1.8;
          margin-bottom: 20px;
          padding-left: 20px;
        }
        code {
          font-family: monospace;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }
        .footer {
          border-top: 1px solid #e2e8f0;
          margin-top: 36px;
          padding-top: 12px;
          font-size: 10px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      ${getHTML()}
      <div class="footer">
        Generated by Threat2Risk AI — Event-Wise Report Engine. Content grounded in correlated event evidence.
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWin = window.open('', '_blank', 'width=850,height=1100');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(fullDocument);
    printWin.document.close();
  }
}
