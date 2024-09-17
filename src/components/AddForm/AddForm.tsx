import React, {useEffect, useState} from "react";
import "./AddForm.css"
import {ideaType} from "../calendar/Calendar";

type AddFormProps = {
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
    dateInputRef: React.RefObject<HTMLInputElement>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    setGiveDate: (value: React.SetStateAction<boolean>) => void;
    currentDate?: Date;
    addIdea(id: string, newIdea: ideaType): void
}

const AddForm = ({setOpenForm, setCurrentDate, dateInputRef, currentDate, setGiveDate, addIdea}: AddFormProps) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | null>(currentDate && currentDate instanceof Date ? currentDate : null);
    const [description, setDescription] = useState("");

    const isFormValid = title.trim() !== "" && date !== null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        date && addIdea(date?.toLocaleDateString(), {date, description, title})
        setGiveDate(false)
        setOpenForm(false)
    }

    return (
        <div className="addForm-container" onClick={() => {
            setGiveDate(false)
            setOpenForm(false)
        }}>
            <form onSubmit={(e) => {
                handleSubmit(e)
            }} className="addForm-body"
                  onClick={(e) => {
                      e.stopPropagation();
                  }}
            >
                <h2>Add new idea item</h2>
                <label htmlFor="">Title <span className="required">*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    required
                />
                <label htmlFor="">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                ></textarea>
                <label htmlFor="">Date <span className="required">*</span></label>
                {date ? (
                    <input
                        type="date"
                        id="calendar-button"
                        ref={dateInputRef}
                        value={date.toISOString().split('T')[0]}
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            if (!isNaN(selectedDate.getTime())) {
                                setCurrentDate(selectedDate);
                                setDate(selectedDate);
                            }
                        }}
                        required
                    />
                ) : (
                    <input
                        type="date"
                        id="calendar-button"
                        ref={dateInputRef}
                        onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            if (!isNaN(selectedDate.getTime())) {
                                setCurrentDate(selectedDate);
                                setDate(selectedDate);
                            }
                        }}
                        required
                    />
                )}


                <button type="submit" disabled={!isFormValid}>
                    SAVE
                </button>
            </form>
            s
        </div>
    )
}

export {AddForm};