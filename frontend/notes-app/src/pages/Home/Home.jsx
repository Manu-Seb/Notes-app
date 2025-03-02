import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../pages/Home/AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import addNoteImg from "../../assets/images/addNoteImg.svg";
import ViewNote from "../../pages/Home/ViewNote";

Modal.setAppElement("#root"); // Or the ID of your app's root element

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([]);

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [isSearch, setIsSearch] = useState(false);

  const showToast = (message, type) => {
    setShowToastMessage({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMessage({ isShown: false, message: "", type: "add" });
  };

  const handleEdit = (noteDetails) => {
    if (openViewModal.isShown === true) {
      setOpenViewModal({ isShown: false, data: null }, () => {
        setAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
      });
    } else {
      setAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    }
  };

  const openView = (noteDetails) => {
    setOpenViewModal({ isShown: true, data: noteDetails });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred");
    }
  };

  const deleteNote = async (data) => {
    if (!data) {
      console.error("deleteNote called with null data");
      return; // Exit the function if data is null
    }
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      console.log(response);
      if (response.data && response.data.message) {
        showToast("Note Deleted Successfully", "delete");
        getAllNotes();
        setOpenViewModal({ isShown: false, data: null });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("unexpected error has occurred");
      }
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes/", {
        params: { query },
      });
      console.log(response.data);

      if (response.data && response.data.matchingNotes) {
        setIsSearch(true);
        setAllNotes(response.data.matchingNotes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updatePinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );
      console.log(response);
      if (response.data && response.data.message) {
        showToast("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    //console.log(userInfo);
    return () => {};
  }, []);

  const [openAddEditModal, setAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8 ">
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updatePinned(item)}
                onView={() => openView(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={addNoteImg}
            message={
              "Welcome to your first Entry into your Notes. Let's Start by creating a note! Click on the + button to get started!!"
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 hover:drop-shadow-2xl cursor-pointer absolute right-10 bottom-10"
        onClick={() => {
          setAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setAddEditModal({ isShown: false, data: null })} // Corrected line
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          },
          content: {
            overflow: "auto",
          },
        }}
        contentLabel=""
        className="w-[40%] mx-auto max-h-3/4 mt-14 p-5 overflow-scroll bg-white"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToast={showToast}
        />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          },
          content: {
            // Style the modal content itself
            overflow: "auto", // Add styles as needed (e.g., background color, padding, etc.)
          },
        }}
        contentLabel=""
        className="w-[40%] mx-auto min-h-1/2 max-h-3/4 mt-14 p-5 overflow-scroll bg-white"
      >
        <ViewNote
          noteData={openViewModal.data}
          onClose={() => {
            setOpenViewModal({ isShown: false, type: "add", data: null });
          }}
          onEdit={() => handleEdit(openViewModal.data)}
          onDelete={() => deleteNote(openViewModal.data)}
        />
      </Modal>

      <Toast
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
