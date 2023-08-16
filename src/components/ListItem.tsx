import React from "react";
import { SavedData } from "../libs/dataTypes";
import deleteIcon from "../assets/images/delete.svg";

interface ListItemProps {
    item: SavedData;

    index: number;
    deleteItem: (index: number) => void;
}

function handleUrlClick(url: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
            const activeTab = tabs[0];
            const activeTabUrl = activeTab.url;
            if (
                activeTabUrl?.startsWith(
                    "https://kampusmerdeka.kemdikbud.go.id/program/studi-independen/browse/"
                ) ||
                activeTabUrl?.startsWith(
                    "https://kampusmerdeka.kemdikbud.go.id/program/magang/browse/"
                )
            ) {
                chrome.tabs.sendMessage(activeTab.id!, { url: url }, (response) => {
                    if (!response.message) {
                        chrome.tabs.query(
                            { active: true, currentWindow: true },
                            (tabs) => {
                                chrome.tabs.update(tabs[0].id!, {
                                    url: url,
                                    active: true,
                                });
                            }
                        );
                    }
                });
                return;
            }
        }
    });
}

const ListItem: React.FC<ListItemProps> = ({ item, index, deleteItem }) => {
    return (
        <li>
            <a
                onClick={(e) => {
                    e.preventDefault();
                    handleUrlClick(item.href);
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
