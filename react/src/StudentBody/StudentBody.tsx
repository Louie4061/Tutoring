// This is where we will store similiar html to how the student appears
import { useState } from 'react';
import styles from './StudentBody.module.css';
import StudentHeader from './StudentHeader';

export interface student {
    name: string;
    id: string;
    country: string;
    school: string;
    year: number;
    phone: string;
    email: string;
    subject: string;
    syllabus_link: string;
    current_topics: string;
    tutoring_schedule: string[];
    other_availability: string[];
    worksheets: {
        title: string;
        type: 'needed' | 'completed';
        date?: string;
        link: string;
    }[];
    test_scores: {
        test_name: string;
        score: number;
    }[];
}

export interface WrapperProp {
    title?: string;
    children: React.ReactNode;
}

export interface StudentWordProp {
    word?: string;
    student: student;
}

export function SheetSection({ student }: StudentBodyProps) {
    const syllabus_link =
        <a
            href={student.syllabus_link}
            className={styles.syllabus_link}
            target="_blank"
            rel="noopener noreferrer"
        >
            View {student.subject} Syllabus
        </a>
    return (
        syllabus_link
    );
}

// children just refers to whatever is inside
export function Wrapper({ title, children }: WrapperProp) {
    return (
        <div className={styles.info_grid}>
            <div className={styles.info_item}>
                <span className={styles.info_label}>{title}</span>
                <div className={styles.tutoring_schedule}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export function WrapWorksheet({ word, student }: StudentWordProp) {
    return (
        <div className={styles.worksheet_list}>
            <div className={styles.info_label}>{word} worksheets</div>
            {student.worksheets
                .filter(w => w.type === word)
                .map((w, idx) => (
                    <a
                        href={w.link}
                        className={styles.syllabus_link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div key={idx} className={styles.worksheet_item}>
                            {w.title} ({w.date})
                        </div>
                    </a>

                ))}
        </div>
    );
}

// // are these passed in on the stack
// export function editWrapper({ word, student }: StudentWordProp) {
//     return (
//         <Wrapper title={word}>
//             <input
//                 type="email"
//                 value={student.email}
//                 onChange={(e) =>
//                     setSelectedStudent({ ...selectedStudent, email: e.target.value })
//                 }
//             />
//         </Wrapper>
//     )
// }

export interface StudentBodyProps {
    student: student;
};
export function StudentBody({ student }: StudentBodyProps) {
    const [showPopup, setShowPopup] = useState(false);

    // Do I really need to do this if I have student as a parameter,
    // Do I need a state variable?
    // I can do something like this in front of the input:
    // <label>Name:</label>
    // on save we may send selectedStudent to the database to deal with some stuff
    const [selectedStudent, setSelectedStudent] = useState<student | null>(student)
    if (showPopup && selectedStudent) {
        return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <h2>Edit Student Info</h2>

                    < Wrapper title="name">
                        <input
                            type="text"
                            value={selectedStudent.name}
                            onChange={(e) =>
                                setSelectedStudent({ ...selectedStudent, name: e.target.value })
                            }
                        /></Wrapper>
                    < Wrapper title="email">
                        <input
                            type="text"
                            value={selectedStudent.email}
                            onChange={(e) =>
                                setSelectedStudent({ ...selectedStudent, name: e.target.value })
                            }
                        /></Wrapper>
                    < Wrapper title="phone">
                        <input
                            type="text"
                            value={selectedStudent.phone}
                            onChange={(e) =>
                                setSelectedStudent({ ...selectedStudent, name: e.target.value })
                            }
                        /></Wrapper>

                    {/* Add more fields as needed */}

                    {/* <button onClick={() => handleSave(selectedStudent)}>Save</button>
                    <button onClick={() => setEditModalOpen(false)}>Cancel</button> */}
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            </div>
        );
    } else {
        return (
            <>
                <StudentHeader student={student} />
                <div className={styles.info_section}>
                    <div className={styles.section_title}>Student Info</div>
                    < Wrapper title="Syllabus Link">
                        <SheetSection student={student} />
                    </Wrapper>
                    < Wrapper title="Tutoring Schedule" >
                        {student.tutoring_schedule.map((time, idx) => (
                            <div key={idx} className={styles.schedule_item}>
                                {time}
                            </div>
                        ))}
                    </Wrapper>
                    < Wrapper title="Other Availability">
                        {student.other_availability.map((time, idx) => (
                            <div key={idx} className={styles.schedule_item}>
                                {time}
                            </div>
                        ))}
                    </Wrapper>

                    < Wrapper title="Worksheets">
                        < WrapWorksheet word='completed' student={student} />
                        < WrapWorksheet word='needed' student={student} />
                    </Wrapper>

                    < Wrapper title="Test Results">
                        {student.test_scores.map((score, idx) => (
                            <div key={idx} className={styles.score_item}>
                                {score.test_name}: {score.score}%
                            </div>
                        ))}
                    </Wrapper>
                </div>

                <button onClick={() => setShowPopup(true)} className={styles.edit_btn} data-id={student.id}>
                    Edit
                </button>

                <hr className="divider"></hr>
            </>
        );
    }
}