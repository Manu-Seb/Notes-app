import React, { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose, MdEditNote } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes, showToast }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      console.log(response);
      if (response.data && response.data.message) {
        getAllNotes();
        onClose();
        showToast("Note Added Successfully");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      console.log(response);
      if (response.data && response.data.message) {
        showToast("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Enter a Title");
      return;
    }
    if (!content) {
      setError("Please add content");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => onClose()}
        className="w-10 h-10 flex items-center justify-center absolute top-3 right-3 rounded-full hover:bg-slate-100"
      >
        <MdClose className="text-sm text-slate-900 hover:text-slate-600" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          className="text-2xl outline-none text-slate-950"
          text="text"
          placeholder="Go to the gym at 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col mt-2 gap-2">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-2xl outline-none text-slate-950 bg-slate-50 rounded"
          text="text"
          placeholder="content and shi"
          rows={10}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </div>
      <div className="mt-4">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-xs text-red-600 pt-4">{error}</p>}

      <button
        onClick={() => {
          handleAddNote();
        }}
        className="btn-primary w-full rounded mt-3 p-3"
      >
        {type === "edit" ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default AddEditNotes;
