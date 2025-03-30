import React, { useState, useContext } from "react";
import { addExam } from "../../services/examService";
import { UserContext } from "../../context/UserReducer"; // חיבור לקונטקסט

const AddExam: React.FC = () => {
    const { user } = useContext(UserContext); // קבלת המשתמש מהקונטקסט

    const [formData, setFormData] = useState({
        subject: "",
        title: "",
        classNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.id) {
            alert("שגיאה: משתמש לא מחובר");
            return;
        }

        try {
            await addExam(user.id, formData.subject, formData.title, formData.classNumber);
            alert("המבחן נוסף בהצלחה!");
            setFormData({ subject: "", title: "", classNumber: "" });
        } catch (error) {
            alert("שגיאה בהוספת המבחן. נסה שוב.");
        }
    };

    return (
        <div>
            <h2>הוספת מבחן חדש</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>נושא:</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
                <div>
                    <label>כותרת:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>כיתה:</label>
                    <input type="text" name="classNumber" value={formData.classNumber} onChange={handleChange} required />
                </div>
                <button type="submit">הוסף מבחן</button>
            </form>
        </div>
    );
};

export default AddExam;
