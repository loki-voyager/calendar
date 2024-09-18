import "./Calendar.css";
import {useEffect, useRef, useState} from "react";
import {AddForm} from "../addForm/AddForm";
import {EditForm} from "../editForm/EditForm";

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

    useEffect(() => {
        localStorage.setItem('currentDate', currentDate.toISOString());
    }, [currentDate]);

    const [openForm, setOpenForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [giveDate, setGiveDate] = useState(false);
    const [giveIdea,setGiveIdea] = useState<ideaType>()
    const [giveIdeaId,setGiveIdeaId] = useState<string>("")
    const [giveIdeaIndex,setGiveIdeaIndex] = useState<number>(0)

    const [ideas, setIdeas] = useState<{ [key: string]: ideaType[] }>(() => {
        const savedIdeas = localStorage.getItem('ideas');
        if (savedIdeas) {
            const parsedIdeas = JSON.parse(savedIdeas) as { [key: string]: ideaType[] };
            return Object.fromEntries(
                Object.entries(parsedIdeas).map(([key, ideasArray]) => [
                    key,
                    ideasArray.map((idea: ideaType) => ({
                        ...idea,
                        date: new Date(idea.date),
                    })),
                ])
            );
        }
        return {};
    });

    useEffect(() => {
        localStorage.setItem('ideas', JSON.stringify(ideas));
    }, [ideas]);

    const addIdea = (id: string, newIdea: ideaType) => {
        setIdeas((prevIdeas) => ({
            ...prevIdeas,
            [id]: [...(prevIdeas[id] || []), newIdea],
        }));
    };

    const updateIdea = (oldId: string, index: number, updatedIdea: ideaType) => {
        const newId = updatedIdea.date.toLocaleDateString();

        setIdeas((prevIdeas) => {
            const updatedIdeas = { ...prevIdeas };

            updatedIdeas[oldId] = updatedIdeas[oldId].filter((_, i) => i !== index);

            if (updatedIdeas[oldId].length === 0) {
                delete updatedIdeas[oldId];
            }

            if (updatedIdeas[newId]) {
                updatedIdeas[newId] = [updatedIdea, ...updatedIdeas[newId]];
            } else {
                updatedIdeas[newId] = [updatedIdea];
            }

            return updatedIdeas;
        });
    };

    const deleteIdea = (id: string, index: number) => {
        setIdeas((prevIdeas) => {
            const updatedIdeas = { ...prevIdeas };

            updatedIdeas[id] = updatedIdeas[id].filter((_, i) => i !== index);

            if (updatedIdeas[id].length === 0) {
                delete updatedIdeas[id];
            }

            return updatedIdeas;
        });
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
                            {dateIdeas.map((idea, index) => (
                                <a
                                    key={`idea-${idea.date.toLocaleDateString()}-${index}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenEditForm(true)
                                        setGiveIdea(idea)
                                        setGiveIdeaId(idea.date.toLocaleDateString())
                                        setGiveIdeaIndex(index)
                                    }}
                                >
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
            {(openEditForm && giveIdea) && (
                <EditForm
                    setOpenForm={setOpenEditForm}
                    setCurrentDate={setCurrentDate}
                    dateInputRef={dateInputRef}
                    idea={giveIdea}
                    ideaId={giveIdeaId}
                    ideaIndex={giveIdeaIndex}
                    updateIdea={updateIdea}
                    deleteIdea={deleteIdea}
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
