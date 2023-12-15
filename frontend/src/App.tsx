import { useQuery } from "react-query";
import { GetNotes, GetTags } from "../wailsjs/go/main/App";
import "./App.css";
import { NotesList } from "./components/NoteList";
import { Note, NoteSortOption, Tag } from "./models";
import { useState, useMemo } from "react";
import styles from "./App.module.scss";
import { NoteDetail } from "./components/NoteDetail";
import { NoteSortingDropdown } from "./components/NoteSortingDropdown";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<NoteSortOption>("creationDate");

  const sorted = useMemo(() => {
    switch (sortOption) {
      case "name":
        return notes.sort((a, b) => (a.subject < b.subject ? -1 : 1));
      case "creationDate":
        return notes
          .sort((a, b) => (a.createdOn < b.createdOn ? -1 : 1))
          .reverse();
      default:
        return notes;
    }
  }, [notes, sortOption]);

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

  if (isFetchingNotes || isFetchingTags) {
    return <h1>Loading</h1>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.pane}>
        <NotesList
          notes={sorted}
          className={styles.list}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <div className={styles.sortOptions}>
          <NoteSortingDropdown
            selectedSortOption={sortOption}
            onSelect={(opt) => setSortOption(opt)}
          />
        </div>
      </section>
      <div className={styles.detail}>
        {selectedIndex !== null && (
          <>
            <div className={styles.note}>
              <NoteDetail
                note={sorted[selectedIndex]}
                tags={tags.filter((t) =>
                  sorted[selectedIndex].tagIds.includes(t.id)
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
