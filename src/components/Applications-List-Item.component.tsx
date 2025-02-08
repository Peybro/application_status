import { doc, updateDoc, getFirestore, deleteDoc } from "firebase/firestore";
import { app } from "../firebase";
import { useState } from "react";
import { toast } from "react-toastify";

export const statusLabels = {
  noch_nicht_versendet: "Noch nicht versendet",
  offen: "Offen",
  abgelehnt_1: "Abgelehnt vor 1",
  abgelehnt_2: "Abgelehnt nach 1",
  abgelehnt_3: "Abgelehnt nach 2",
  keine_antwort: "Keine Antwort",
  zusage: "Zusage",
} as const;

export type Status = keyof typeof statusLabels;

export const statusOptions: Status[] = Object.keys(statusLabels) as Status[];

export type ApplicationProps = {
  id: string;
  Name: string;
  Stelle: string;
  Ort: string;
  Status: Status;
  Datum: string;
  Link: string;
};

export function ApplicationsListItem({
  data,
  nr,
  onEditStart: onEditMode,
  onEditStop,
  editInProgress,
}: {
  data: ApplicationProps;
  nr: number;
  onEditStart: () => void;
  onEditStop: () => void;
  editInProgress: boolean;
}) {
  async function updateStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateDoc(doc(getFirestore(app), "applications", data.id), {
      Status: e.target.value,
    });
  }

  async function updateApplication() {
    setEditMode(false);
    onEditStop();
    await updateDoc(doc(getFirestore(app), "applications", data.id), {
      Name: firmenName,
      Stelle: jobTitel,
      Ort: ort,
      Status: status,
      Datum: datum,
      Link: link,
    });
  }

  const [firmenName, setFirmenName] = useState(data["Name"]);
  const [jobTitel, setJobTitel] = useState(data["Stelle"]);
  const [ort, setOrt] = useState(data["Ort"]);
  const [status, setStatus] = useState<Status>(data["Status"]);
  const [datum, setDatum] = useState(data["Datum"]);
  const [link, setLink] = useState(data["Link"]);

  const [editMode, setEditMode] = useState(false);

  async function deleteEntry() {
    await deleteDoc(doc(getFirestore(app), "applications", data.id)).then(
      () => {
        toast("Eintrag gelöscht");
      }
    );
  }

  return (
    <>
      {!editMode && (
        <>
          <tr key={data["id"]}>
            <td>{nr}</td>
            <td>{data["Name"]}</td>
            <td>
              <a href={data["Link"]} target="_blank" rel="noreferrer">
                {data["Stelle"] ? data["Stelle"] : "<kein Titel angegeben>"}
              </a>
            </td>
            <td>{data["Ort"]}</td>
            <td>
              <select
                onChange={(e) => updateStatus(e)}
                defaultValue={data["Status"]}
              >
                {statusOptions.map((state) => {
                  return (
                    <option key={state} value={state}>
                      {statusLabels[state]}
                    </option>
                  );
                })}
              </select>
            </td>
            <td>{data["Datum"]}</td>
            {editInProgress && <td></td>}
            <td>
              <button
                className="outline secondary"
                onClick={() => {
                  setEditMode(true);
                  onEditMode();
                }}
              >
                Bearbeiten
              </button>
            </td>
          </tr>
        </>
      )}

      {editMode && (
        <tr key={data["Name"]}>
          <td>
            <input
              type="text"
              placeholder="Firmenname"
              defaultValue={data["Name"]}
              onInput={(e) => setFirmenName(e.currentTarget.value)}
            />
          </td>
          <td>
            <input
              type="text"
              placeholder="Job Titel"
              defaultValue={data["Stelle"]}
              onInput={(e) => setJobTitel(e.currentTarget.value)}
            />
          </td>
          <td>
            <input
              type="text"
              placeholder="Ort"
              defaultValue={data["Ort"]}
              onInput={(e) => setOrt(e.currentTarget.value)}
            />
          </td>
          <td>
            <select
              defaultValue={data["Status"]}
              onChange={(e) => setStatus(e.currentTarget.value as Status)}
            >
              {statusOptions.map((state) => {
                return (
                  <option key={state} value={state}>
                    {statusLabels[state]}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              type="date"
              placeholder="Datum"
              defaultValue={data["Datum"]}
              onInput={(e) => setDatum(e.currentTarget.value)}
            />
          </td>
          <td style={{ overflow: "hidden" }}>
            <input
              type="text"
              placeholder="Link"
              defaultValue={data["Link"]}
              onInput={(e) => setLink(e.currentTarget.value)}
            />
          </td>
          <td>
            <button className="outline secondary" onClick={deleteEntry}>
              Löschen
            </button>
            <button className="" onClick={() => updateApplication()}>
              Fertig
            </button>
          </td>
        </tr>
      )}
    </>
  );
}
