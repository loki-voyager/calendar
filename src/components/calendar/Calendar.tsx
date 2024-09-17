import "./Calendar.css";
import { useRef, useState} from "react";
import {AddForm} from "../AddForm/AddForm";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ideaType = {
    title: string;
    description: string;
    date: Date;
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState<Date>(() => {
        const savedDate = localStorage.getItem('currentDate');
        return savedDate ? new Date(savedDate) : new Date();
    });

    const [openForm, setOpenForm] = useState(false);
    const [giveDate, setGiveDate] = useState(false);

    const [ideas, setIdeas] = useState<{ [key: string]: ideaType[] }>({});

    const addIdea = (id: string, newIdea: ideaType) => {
        setIdeas((prevIdeas) => ({
            ...prevIdeas,
            [id]: [...(prevIdeas[id] || []), newIdea],
        }));
    };

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const findIdeaById = (id: string) => {
        return ideas[id];
    };

    const generateCalendarDays = () => {
        const days = [];
        const startDay = startOfMonth.getDay();

        for (let i = 0; i < startDay; i++) {
            days.push(<button className="empty-day" key={`empty-${i}`}></button>);
        }

        for (let day = 1; day <= endOfMonth.getDate(); day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            date.setHours(12, 0, 0, 0);
            const dayOfWeek = daysOfWeek[date.getDay()];

            const dateIdeas = findIdeaById(date.toLocaleDateString());

            days.push(
                <div
                    key={`day-${day}-${currentDate.getMonth()}`}
                    className="calendar-day"
                    onClick={() => {
                        setCurrentDate(date);
                        setGiveDate(true);
                        setOpenForm(true);
                    }}
                >
                    <p>
                        {day} - {dayOfWeek}
                    </p>
                    {dateIdeas &&
                        <>
                            {dateIdeas.map((idea,index) => (
                                <a key={`idea-${idea.date.toLocaleDateString()}-${index}`}>
                                    {idea.title}
                                </a>
                            ))}
                        </>
                    }
                </div>
            );
        }

        return days;
    };


    const dateInputRef = useRef<HTMLInputElement>(null);

    const openCalendar = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    return (
        <>
            {openForm && (
                <AddForm
                    setGiveDate={setGiveDate}
                    setOpenForm={setOpenForm}
                    setCurrentDate={setCurrentDate}
                    dateInputRef={dateInputRef}
                    addIdea={addIdea}
                    {...(giveDate && {currentDate: currentDate})}
                />
            )}
            <section className="calendar-container wrapper">
                <div className="calendar-header">
                    <button className="calendar-create-button" onClick={() => {
                        setOpenForm(true);
                    }}>+
                    </button>
                    <div className="calendar-control-panel">
                        <button onClick={handlePreviousMonth}>{"<"}</button>
                        <span>
                      {currentDate.toLocaleString('default', {month: 'long'})} {currentDate.getFullYear()}
                    </span>
                        <button onClick={handleNextMonth}>{">"}</button>
                        <div className="calendar-button-container">
                            <input
                                type="date"
                                id="calendar-button"
                                className="calendar-button-hidden"
                                ref={dateInputRef}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value);
                                    if (!isNaN(selectedDate.getTime())) {
                                        setCurrentDate(selectedDate);
                                    }
                                }}
                            />
                            <button
                                className="calendar-button-visible"
                                onClick={openCalendar}
                            >calendar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="calendar-body">
                    <div className="calendar-days">{generateCalendarDays()}</div>
                </div>
            </section>
        </>
    );
};

export {Calendar};
