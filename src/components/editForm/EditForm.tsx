import React, {useState} from "react";
import {ideaType} from "../calendar/Calendar";
import "./EditForm.css"

type EditFormProps = {
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
    dateInputRef: React.RefObject<HTMLInputElement>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    idea: ideaType;
    ideaId: string;
    ideaIndex: number;
    updateIdea(id: string, index: number, updatedIdea: ideaType): void;
    deleteIdea(id: string, index: number): void;
}
const EditForm = ({
                      setOpenForm,
                      dateInputRef,
                      setCurrentDate,
                      idea,
                      updateIdea,
                      ideaId,
                      ideaIndex,
                      deleteIdea
                  }: EditFormProps) => {
    const [title, setTitle] = useState<string>(idea.title);
    const [description, setDescription] = useState<string>(idea.description);
    const [date, setDate] = useState<Date>(idea.date)

    const isFormValid = title.trim() !== "" && date !== null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`edited idea: ${JSON.stringify({date, description, title})}`);
        updateIdea(ideaId, ideaIndex, {date, description, title})
        setOpenForm(false)
    }

    const handleDelete = () => {
        deleteIdea(ideaId,ideaIndex)
        setOpenForm(false)
    }

    return (
        <div className="editForm-container" onClick={() => {
            setOpenForm(false)
        }}>
            <form onSubmit={(e) => {
                handleSubmit(e)
            }} className="editForm-body"
                  onClick={(e) => {
                      e.stopPropagation();
                  }}
            >
                <h2>Edit idea item</h2>
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
                <div className="editForm-button-container">
                    <button className="delete-button" disabled={!isFormValid} onClick={() => {
                        handleDelete()
                    }}>
                        DELETE
                    </button>
                    <button className="save-button" type="submit" disabled={!isFormValid}>
                        SAVE
                    </button>
                </div>
            </form>
        </div>
    )
}

export {EditForm}