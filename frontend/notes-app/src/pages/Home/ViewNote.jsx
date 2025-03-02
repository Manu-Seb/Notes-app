import React, { useState } from "react";
import { MdClose, MdCreate, MdDelete, MdEditNote } from "react-icons/md";

const AddEditNotes = ({ onClose, onEdit, onDelete, noteData }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  return (
    <div className="relative min-h-[300px]">
      <button
        onClick={() => onClose()}
        className="w-10 h-10 flex items-center justify-center absolute top-3 right-3 rounded-full hover:bg-slate-100"
      >
        <MdClose className="text-sm text-slate-900 hover:text-slate-600" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <p>{title}</p>
      </div>

      <div className="flex flex-col mt-2 gap-2">
        <label className="input-label">CONTENT</label>
        <p>{content}</p>
      </div>
      <div className="mt-4">
        <label className="input-label">Tags</label>
        <div className="text-xs text-slate-400">
          {tags.map((item) => `#${item}`)}
        </div>
      </div>
      {error && <p className="text-xs text-red-600 pt-4">{error}</p>}
      <div className="flex items-center gap-2 ">
        <MdCreate
          className="icon-btn hover:text-green-600 cursor-pointer"
          onClick={onEdit}
        />
        <MdDelete
          className="icon-btn hover:text-red-600 cursor-pointer"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default AddEditNotes;
