import { useExamContext } from "../../context/ExamContext";

const examList = () => {
    const { data } = useExamContext();
    return (
        <>
        <div>
            <h2>רשימת מבחנים</h2>
            <ul>
                {data.map((item) =>
                    item.type === "folder" && "folderName" in item ? (
                        <li key={item.id}>📁 {item.folderName}</li>
                    ) : (
                        <li key={item.id}>📄 {item.title} ({item.subject})</li>
                    )
                )}
            </ul>
        </div>
        </>
    )
}
export default examList