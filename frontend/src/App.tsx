import { useQuery } from "react-query";
import { GetNotes, GetTags } from "../wailsjs/go/main/App";
import "./App.css";
import { NotesList } from "./components/NoteList";
import { Note, Tag } from "./models";
import { useState } from "react";
import styles from "./App.module.scss";
import { NoteDetail } from "./components/NoteDetail";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1);
  const { isFetching: isFetchingNotes } = useQuery(
    ["notes"],
    async () => await GetNotes(),
    {
      onSuccess: (data) => {
        const mapped = data.map((x) => {
          const note: Note = {
            id: x.Id,
            content: x.Content,
            createdOn: new Date(x.CreatedOn),
            subject: x.Subject,
            tagIds: x.TagIds,
          };

          return note;
        });
        setNotes(mapped);
      },
    }
  );

  const { isFetching: isFetchingTags } = useQuery(
    ["tags"],
    async () => await GetTags(),
    {
      onSuccess: (data) => {
        const mapped = data.map((x) => {
          const tag: Tag = {
            id: x.Id,
            name: x.Name,
            createdOn: new Date(x.CreatedOn),
          };

          return tag;
        });
        setTags(mapped);
      },
    }
  );

  if (isFetchingNotes) {
    return <h1>Loading</h1>;
  }

  return (
    <div className={styles.container}>
      <NotesList
        notes={notes}
        className={styles.list}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <div className={styles.detail}>
        {selectedIndex !== null && (
          <>
            <div className={styles.note}>
              <NoteDetail
                note={notes[selectedIndex]}
                tags={tags.filter((t) =>
                  notes[selectedIndex].tagIds.includes(t.id)
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
