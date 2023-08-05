import React from "react";
import { SavedData } from "../libs/dataTypes";
import ListItem from "./ListItem";
import { capitalizeWords } from "../libs/capitalizeEachWords";

interface AccordionProps {
    type: string;
    data: SavedData[] | undefined;
    setData: React.Dispatch<React.SetStateAction<SavedData[] | undefined>>;
}

const Accordion: React.FC<AccordionProps> = ({ type, data, setData }) => {
    async function deleteItem(index: number) {
        data?.splice(index, 1);
        setData([...data!]);
        await chrome.storage.local.set({ [type.toLowerCase()]: data });
    }

    const togglerIcon = React.useRef<HTMLDivElement>(null);
    const programList = React.useRef<HTMLUListElement>(null);

    const handleAccordionToglerClick = () => {
        // flip btn icon
        togglerIcon.current?.classList.toggle("flip");
        // hide list
        programList.current?.classList.toggle("hide");
    };

    return (
        <>
            <button className="accordion-toggler" onClick={handleAccordionToglerClick}>
                <h2>{capitalizeWords(type)}</h2>
                <div className="toggler-icon" ref={togglerIcon}></div>
            </button>
            <ul className="program-list" ref={programList}>
                {!data || data.length === 0 ? (
                    <p className="no-data">Empty</p>
                ) : (
                    data.map((item, index) => {
                        return (
                            <ListItem
                                item={item}
                                index={index}
                                key={index}
                                deleteItem={deleteItem}
                            />
                        );
                    })
                )}
            </ul>
        </>
    );
};

export default Accordion;
