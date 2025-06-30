import { useState, useEffect, useRef } from 'react'

// // const [count, setCount] = useState(0)
// useEffect(() => {
//   const connection = createConnection(serverUrl, roomId);
//   connection.connect();
//   connection.sendMessage("Hello");
//   return () => { // this disconnects only when App is unmounted, removed from react tree
//     connection.disconnect();
//   };
// }, [serverUrl, roomId]);

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import type { student } from './StudentBody/StudentBody.tsx';
import { StudentBody } from './StudentBody/StudentBody.tsx';

let sampleStudent: student = {
  name: "Gordon Hewwit",
  id: "stu-001",
  country: "Australia",
  year: 11,
  phone: "0491744588",
  email: "N/A",
  school: "Winmalee High",
  subject: "Advanced Mathematics",
  syllabus_link: "https://educationstandards.nsw.edu.au/wps/wcm/connect/1e8c900d-d848-4ace-ae74-64a372e8af17/2024-hsc-maths-adv.pdf?MOD=AJPERES&CACHEID=ROOTWORKSPACE-1e8c900d-d848-4ace-ae74-64a372e8af17-pbm8WfF",
  current_topics: "Finishing up on some further functions and is begining calculus",
  tutoring_schedule: ["Thursday: 4:30 - 5:30"],
  other_availability: ["None yet"],
  worksheets: [
    { title: "More traingle revision", type: "needed", link: "https://thsconline.github.io/s/v/5226/Sydney%20Grammar%202017%20w.%20sol" },
    { title: "Trigonometry Practice", type: "completed", date: "2025-06-20", link: "https://thsconline.github.io/s/v/5226/Sydney%20Grammar%202017%20w.%20sol" }
  ],
  test_scores: [
    { test_name: "Test1", score: 70 },
    { test_name: "Test2", score: 92 }
  ]
};

function App() {
  const hasRun = useRef(false);
  const [serverUrl, setServerUrl] = useState('/api/tutoring');

  const [data, setData] = useState<student[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<student | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetch(serverUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleStudent)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    fetch(serverUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: student[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (!data) {
    return <>
      <h1>Add Student</h1>
      <button>Add Student</button>
    </>
  } else {
    return (<>
      < StudentBody student={sampleStudent} />
      < StudentBody student={data[0]} />
    </>);
  }
}

export default App
