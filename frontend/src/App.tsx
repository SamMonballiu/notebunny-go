import { useQuery, useQueryClient } from "react-query";
import {
  CreateNote,
  GetNotes,
  GetTags,
  RemoveNote,
  UpdateNote,
} from "../wailsjs/go/main/App";
import "./App.css";
import { NotesList } from "./components/NoteList";
import { CommandResult, Note, NoteSortOption, Tag } from "./models";
import { useState, useMemo, useRef, useEffect } from "react";
import styles from "./App.module.scss";
import { NoteDetail } from "./components/NoteDetail";
import { NoteSortingDropdown } from "./components/NoteSortingDropdown";
import { NoteEdit } from "./components/NoteEdit";
import "./markdown.scss";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { MdAdd, MdEdit, MdDeleteForever } from "react-icons/md";
import { IconButton } from "./components/IconButton";
import { Sidebar } from "./components/Sidebar";

type Viewmode = "list" | "edit" | "create";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<NoteSortOption>("creationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchTerm, setActualSearchTerm] = useState("");
  const [viewmode, setViewmode] = useState<Viewmode>("list");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const searchUpdateTimeout = setTimeout(() => {
      setActualSearchTerm(searchInputValue);
    }, 400);

    return () => clearTimeout(searchUpdateTimeout);
  }, [searchInputValue]);

  const queryClient = useQueryClient();

  const sorted = useMemo(() => {
    let sorted: Note[];

    switch (sortOption) {
      case "name":
        sorted = notes.sort((a, b) => (a.subject < b.subject ? -1 : 1));
        break;
      case "creationDate":
        sorted = notes.sort((a, b) => (a.createdOn < b.createdOn ? -1 : 1));
        break;
      default:
        return notes;
    }

    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [notes, sortOption, sortDirection]);

  const { isFetching: isFetchingNotes } = useQuery(
    ["notes", actualSearchTerm],
    async () => await GetNotes(searchInputValue),
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
        if (mapped.length === 1 && actualSearchTerm !== "") {
          setSelectedIndex(0);
        }
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

  // if (isFetchingNotes) {
  //   return null;
  // }

  const handleCreate = async (
    subject: string,
    content: string,
    tags: string
  ) => {
    const result: CommandResult = await CreateNote(subject, content, tags);
    if (result.Success) {
      setViewmode("list");
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["tags"]);
    } else {
      alert(`An error occurred: ${result.Feedback}`);
    }
  };

  const handleUpdate = async (
    subject: string,
    content: string,
    tags: string
  ) => {
    const selectedNote = sorted[selectedIndex!];
    const result: CommandResult = await UpdateNote(
      selectedNote.id,
      {
        ...selectedNote,
        subject,
        content,
      },
      tags
    );
    if (result.Success) {
      setViewmode("list");
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["tags"]);
    } else {
      alert(`An error occurred: ${result.Feedback}`);
    }
  };

  const handleDelete = async (note: Note) => {
    const id = note.id;
    const result: CommandResult = await RemoveNote(id);
    if (result.Success) {
      queryClient.invalidateQueries(["notes"]);
      queryClient.invalidateQueries(["tags"]);
      setShowDeleteDialog(false);
    } else {
      alert(`An error occurred: ${result.Feedback}`);
    }
  };

  if (viewmode === "list") {
    return (
      <div className={styles.container}>
        <Sidebar>
          <IconButton icon={<MdAdd />} action={() => setViewmode("create")} />
          <IconButton
            icon={<MdEdit />}
            disabled={selectedIndex === null}
            action={() => setViewmode("edit")}
          />
          <IconButton
            icon={<MdDeleteForever />}
            disabled={selectedIndex === null}
            action={() => setShowDeleteDialog(true)}
          />
        </Sidebar>
        <div className={styles.mainPanel}>
          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            title="Delete"
            message={`Are you sure you want to delete '${
              sorted[selectedIndex!]?.subject
            }'? This will remove it from the list.`}
            onConfirm={async () => handleDelete(sorted[selectedIndex!])}
          />
          <section className={styles.main}>
            <section className={styles.pane}>
              <input
                autoFocus
                value={searchInputValue}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    queryClient.invalidateQueries(["notes"]);
                  }
                }}
                onChange={(e) => setSearchInputValue(e.target.value)}
              />
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
                <select
                  value={sortDirection}
                  // @ts-ignore
                  onChange={(e) => setSortDirection(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </section>

            <section className={styles.detail}>
              {selectedIndex !== null &&
                sorted[selectedIndex] !== undefined && (
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
            </section>
          </section>
        </div>
      </div>
    );
  }

  return (
    <NoteEdit
      tags={tags}
      onSave={viewmode === "create" ? handleCreate : handleUpdate}
      onCancel={() => setViewmode("list")}
      note={viewmode === "create" ? undefined : sorted[selectedIndex ?? 0]}
    />
  );
}

export default App;
