import React from "react";
import { SavedData } from "../libs/dataTypes";
import deleteIcon from "../assets/images/delete.svg";

interface ListItemProps {
    item: SavedData;

    index: number;
    deleteItem: (index: number) => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, index, deleteItem }) => {
    return (
        <li>
            <a
                onClick={(e) => {
                    e.preventDefault();
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.tabs.update(tabs[0].id!, {
                            url: item.href,
                            active: true,
                        });
                    });
                    return false;
                }}
                href={item.href}
            >
                <img src={item.companyLogo} alt="company-logo" />
                <div>
                    <p>{item.programName}</p>
                    <p>
                        {item.companyName} - {item.city}
                    </p>
                </div>
            </a>
            <button className="delete-btn">
                <img
                    src={deleteIcon}
                    alt="delete-icon"
                    onClick={async () => {
                        deleteItem(index);
                    }}
                />
            </button>
        </li>
    );
};

export default ListItem;
