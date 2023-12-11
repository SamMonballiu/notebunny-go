import { useQuery } from "react-query";
import { Test } from "../wailsjs/go/main/App";
import "./App.css";
import { NotesList } from "./components/NoteList";
import { Note } from "./models";
import { useState } from "react";
import styles from "./App.module.scss";
import { NoteDetail } from "./components/NoteDetail";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1);
  const { isFetching } = useQuery(["notes"], async () => await Test(), {
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
  });

  if (isFetching) {
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
            <h1>{notes[selectedIndex].subject}</h1>
            <h4>{notes[selectedIndex].createdOn?.toLocaleDateString()}</h4>
            <div className={styles.note}>
              <NoteDetail note={notes[selectedIndex]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
