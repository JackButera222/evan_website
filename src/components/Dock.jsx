import mail from "../assets/mail.png";
import notes from "../assets/notes.png";
import photos from "../assets/photos.png";
import trash from "../assets/trash.png";

function Dock({ onMailClick, onPhotosClick, onNotesClick, onTrashClick }) {
  return (
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-end gap-4 rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl sm:bottom-5 sm:gap-5 sm:px-5">
      {/* Mail */}
      <button
        type="button"
        aria-label="Open Mail"
        onClick={onMailClick}
        className="h-12 w-12 cursor-pointer transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <img src={mail} className="h-full w-full scale-103 object-contain" />
      </button>

      {/* Photos */}
      <button
        type="button"
        aria-label="Open Photos"
        onClick={onPhotosClick}
        className="h-12 w-12 cursor-pointer overflow-hidden transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <img
          src={photos}
          className="h-full w-full scale-107 object-contain"
        />
      </button>

      {/* Notes */}
      <button
        type="button"
        aria-label="Open Notes"
        onClick={onNotesClick}
        className="h-12 w-12 cursor-pointer transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <img src={notes} className="w-full h-full object-contain" />
      </button>

      <div className="mx-1 h-10 w-px self-center bg-white/25 sm:h-12" />

      {/* Trash */}
      <button
        type="button"
        aria-label="Open Trash"
        onClick={onTrashClick}
        className="h-12 w-12 cursor-pointer overflow-hidden transition-transform hover:scale-110 sm:h-14 sm:w-14"
      >
        <img
          src={trash}
          className="relative left-[45%] h-[94%] w-auto max-w-none -translate-x-1/2 scale-110 object-contain"
        />
      </button>
    </div>
  );
}

export default Dock;
