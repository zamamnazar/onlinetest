import React from 'react';

const ArchitectureDoc: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Product Design Architecture (PDA)</h2>
            <p className="text-slate-500 text-sm">Online MCQ Test Application Specification</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
            
            <section className="mb-8">
                <h3 className="text-xl font-bold text-blue-700 mb-2">1. System Overview</h3>
                <p className="text-slate-600">
                    The <strong>NexusExam</strong> platform is a scalable, hybrid web application designed to facilitate online assessments. 
                    It bridges the gap between Educators (who create and analyze tests) and Learners (who attempt tests and track progress). 
                    The system prioritizes real-time performance, secure authentication, and data-driven insights.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <section>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">2. Architecture Diagram</h3>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs leading-relaxed">
                        <pre>{`
+------------------+       +------------------+
|   Client (Web)   |       |   Client (Mobile)|
| (React/Tailwind) |       |     (Flutter)    |
+--------+---------+       +---------+--------+
         |                           |
         +-------------+-------------+
                       | HTTPS / REST / WSS
                       v
            +---------------------+
            |    Load Balancer    |
            +----------+----------+
                       |
        +--------------+--------------+
        |  Backend API Cluster (Node) |
        |  (Auth, Quiz Logic, Stats)  |
        +--------------+--------------+
                       |
    +-----------+------+-------+------------+
    |           |              |            |
+---+---+   +---+---+      +---+----+   +---+---+
| Auth  |   | Cache |      | Primary|   |  AI   |
| (JWT) |   |Redis  |      |   DB   |   |Gemini |
+-------+   +-------+      +--------+   +-------+
                        (Postgres/Mongo)
                        `}</pre>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">3. Entity-Relationship Diagram</h3>
                    <ul className="space-y-3 text-sm text-slate-700 border-l-2 border-blue-200 pl-4">
                        <li><strong>Users:</strong> <code>id (PK), email, password_hash, role, created_at</code></li>
                        <li><strong>Tests:</strong> <code>id (PK), teacher_id (FK), title, duration, settings_json</code></li>
                        <li><strong>Questions:</strong> <code>id (PK), test_id (FK), text, type, points</code></li>
                        <li><strong>Answers:</strong> <code>id (PK), question_id (FK), text, is_correct</code></li>
                        <li><strong>Attempts:</strong> <code>id (PK), test_id (FK), user_id (FK), score, completed_at</code></li>
                        <li><strong>Responses:</strong> <code>id (PK), attempt_id (FK), question_id (FK), answer_id (FK)</code></li>
                    </ul>
                </section>
            </div>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-blue-700 mb-2">4. Core API Endpoints</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-100 text-slate-800 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-2">Method</th>
                                <th className="px-4 py-2">Endpoint</th>
                                <th className="px-4 py-2">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            <tr><td className="px-4 py-2 font-mono text-blue-600">POST</td><td className="px-4 py-2">/api/auth/login</td><td>Authenticate user & return JWT</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-green-600">GET</td><td className="px-4 py-2">/api/tests</td><td>Fetch available tests (filtered by role)</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-blue-600">POST</td><td className="px-4 py-2">/api/tests</td><td>Create a new test (Teacher only)</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-blue-600">POST</td><td className="px-4 py-2">/api/attempts</td><td>Submit test responses & calc score</td></tr>
                            <tr><td className="px-4 py-2 font-mono text-green-600">GET</td><td className="px-4 py-2">/api/analytics/:id</td><td>Get detailed report for test/student</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-blue-700 mb-2">5. App Flow Sequence</h3>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                    <li><strong>Test Creation:</strong> Teacher Logs in &rarr; Dashboard &rarr; "Create Test" &rarr; Details &rarr; Add Questions (Manual/AI) &rarr; Publish.</li>
                    <li><strong>Test Taking:</strong> Student Logs in &rarr; "Available Tests" &rarr; Select Test &rarr; "Start" (Timer begins) &rarr; Answer Qs &rarr; Submit.</li>
                    <li><strong>Result Generation:</strong> System validates answers &rarr; Calculates Score &rarr; Saves Attempt &rarr; Updates Analytics &rarr; Shows Instant Result.</li>
                </ol>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">6. Tech Stack Justification</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                        <li><strong>React:</strong> Component-based architecture allows reusing UI for Test creation and Taking. Virtual DOM ensures smooth timer/navigation performance.</li>
                        <li><strong>Tailwind CSS:</strong> Rapid UI development with utility-first classes; responsive by default for mobile users.</li>
                        <li><strong>Node.js/Express:</strong> Non-blocking I/O is ideal for handling concurrent test submissions.</li>
                        <li><strong>MongoDB:</strong> JSON-like document structure fits nested Test/Question/Option data perfectly without complex joins.</li>
                    </ul>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">7. Security & Scalability</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                        <li><strong>JWT Auth:</strong> Stateless authentication scales horizontally across multiple server instances.</li>
                        <li><strong>Anti-Cheat:</strong> Frontend tab-switch detection + Backend timestamp validation to prevent extending time.</li>
                        <li><strong>DB Indexing:</strong> Indexes on <code>student_id</code> and <code>test_id</code> for O(1) retrieval of history.</li>
                        <li><strong>Caching:</strong> Redis to cache "Active Tests" to reduce DB load during peak exam times.</li>
                    </ul>
                </section>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ArchitectureDoc;
