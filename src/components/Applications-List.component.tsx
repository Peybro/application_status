import {
  getFirestore,
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { app } from "../firebase";
import {
  ApplicationProps,
  ApplicationsListItem,
} from "./Applications-List-Item.component";
import { NewApplication } from "./New-Application.component";
import { useState } from "react";

export function ApplicationsList() {
  const [editMode, setEditMode] = useState<number>(0);
  const [value, loading, error] = useCollection(
    collection(getFirestore(app), "applications"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<keyof ApplicationProps>("Name");

  const sortApplications = (
    a: QueryDocumentSnapshot<DocumentData, DocumentData>,
    b: QueryDocumentSnapshot<DocumentData, DocumentData>
  ) => {
    const aData = a.data() as ApplicationProps;
    const bData = b.data() as ApplicationProps;
    return aData[sort].localeCompare(bData[sort]);
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        {search !== "" && <button onClick={() => setSearch("")}>Reset</button>}
        <input
          type="text"
          placeholder="Suche"
          value={search}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
      </div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Lade Bewerbungen...</span>}
      {value && value.docs.length === 0 && (
        <span>Keine Bewerbungen vorhanden</span>
      )}
      {value && value.docs.length > 0 && (
        <table>
          <thead>
            <tr style={{ top: 0, position: "sticky" }}>
              <th>#</th>
              <th onClick={() => setSort("Name")} style={{ cursor: "pointer" }}>
                Name
              </th>
              <th
                onClick={() => setSort("Stelle")}
                style={{ cursor: "pointer" }}
              >
                Stelle
              </th>
              <th onClick={() => setSort("Ort")} style={{ cursor: "pointer" }}>
                Ort
              </th>
              <th
                onClick={() => setSort("Status")}
                style={{ cursor: "pointer" }}
              >
                Status
              </th>
              <th
                onClick={() => setSort("Datum")}
                style={{ cursor: "pointer" }}
              >
                Datum
              </th>
              {editMode > 0 && <th>Link</th>}
              <th>
                <NewApplication></NewApplication>
              </th>
            </tr>
          </thead>
          <tbody>
            {search === "" &&
              value.docs
                .sort(sortApplications)
                .map((doc, i) => (
                  <ApplicationsListItem
                    key={doc.data().id}
                    data={doc.data() as ApplicationProps}
                    nr={i + 1}
                    onEditStart={() => setEditMode((old) => old + 1)}
                    onEditStop={() => setEditMode((old) => old - 1)}
                    editInProgress={editMode > 0}
                  />
                ))}
            {search !== "" &&
              value.docs
                .filter((doc) => {
                  const data = doc.data() as ApplicationProps;
                  return (
                    data.Name.toLowerCase().includes(search.toLowerCase()) ||
                    data.Stelle.toLowerCase().includes(search.toLowerCase()) ||
                    data.Ort.toLowerCase().includes(search.toLowerCase()) ||
                    data.Status.toLowerCase().includes(search.toLowerCase()) ||
                    data.Datum.toLowerCase().includes(search.toLowerCase())
                  );
                })
                .sort(sortApplications)
                .map((doc, i) => (
                  <ApplicationsListItem
                    key={doc.data().id}
                    data={doc.data() as ApplicationProps}
                    nr={i + 1}
                    onEditStart={() => setEditMode((old) => old + 1)}
                    onEditStop={() => setEditMode((old) => old - 1)}
                    editInProgress={editMode > 0}
                  />
                ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
