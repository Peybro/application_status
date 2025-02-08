import { useState } from "react";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { statusLabels } from "./Applications-List-Item.component";

export function NewApplication() {
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);

    // const data = Object.fromEntries(formData.entries());

    const uuid = uuidv4();

    await setDoc(doc(getFirestore(app), "applications", uuid as string), {
      id: uuid,
      Name: name,
      Stelle: jobTitle,
      Ort: location,
      Status: status,
      Datum: date,
      Link: link,
    }).then(() => {
      setModalOpen(false);
      toast.success("Bewerbung eingetragen");
      setName("");
      setJobTitle("");
      setLocation("");
      setStatus("");
      setDate("");
      setLink("");
    });
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Neue Bewerbung</button>

      <dialog open={modalOpen}>
        <article>
          <header>
            <button
              aria-label="Close"
              rel="prev"
              onClick={() => setModalOpen(false)}
            ></button>
            <p>
              <strong>Neue Bewerbung</strong>
            </p>
          </header>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <label>
                Name
                <input
                  name="name"
                  placeholder="Firmenname"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Stelle
                <input
                  name="job_title"
                  placeholder="Job Titel"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </label>
              <label>
                Ort
                <input
                  name="location"
                  placeholder="Ort"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <label>
                Status
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {Object.values(statusLabels).map((state) => {
                    return (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    );
                  })}
                </select>
              </label>
              <label>
                Datum
                <input
                  type="date"
                  name="date"
                  placeholder="Datum"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Link
                <input
                  type="text"
                  name="link"
                  placeholder="Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </label>
            </fieldset>

            <button type="submit">Bewerbung eintragen</button>
          </form>
        </article>
      </dialog>
    </>
  );
}
