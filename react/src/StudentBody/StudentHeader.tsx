import styles from './StudentBody.module.css';
import type { StudentBodyProps } from './StudentBody.tsx';

function StudentHeader({ student }: StudentBodyProps) {
    return (
        <>
            <div className={styles.student_header}>
                <div>
                    <div className={styles.student_name}>{student.name}</div>
                    <div className={styles.student_school}>
                        {student.school} • Year {student.year}
                    </div>
                </div>
                <div>{student.email}</div>
            </div>
        </>);

}

export default StudentHeader;