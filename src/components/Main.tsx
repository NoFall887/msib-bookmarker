import React, { useEffect, useState } from "react";
import { SavedData, TypeString } from "../libs/dataTypes";
import Accordion from "./Accordion";

async function getData(
    key: string,
    setData: React.Dispatch<React.SetStateAction<SavedData[] | undefined>>
): Promise<void> {
    setData((await chrome.storage.local.get([key]))[key]);
}

const Main: React.FC = () => {
    const [dataMagang, setDataMagang] = useState<SavedData[] | undefined>();
    const [dataSIB, setDataSIB] = useState<SavedData[] | undefined>();

    useEffect(() => {
        getData(TypeString.MAGANG, setDataMagang);
        getData(TypeString.STUDI_INDEPENDEN, setDataSIB);
    }, []);

    return (
        <main>
            <div className="accordion-container">
                <Accordion
                    data={dataMagang}
                    type={TypeString.MAGANG}
                    setData={setDataMagang}
                />
                <Accordion
                    data={dataSIB}
                    type={TypeString.STUDI_INDEPENDEN}
                    setData={setDataSIB}
                />
            </div>
        </main>
    );
};

export default Main;
