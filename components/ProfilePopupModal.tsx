import { FC, Fragment } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";

interface ProfilePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramHandle: string | null;
  telegramData: any;
}

const ProfilePopupModal: FC<ProfilePopupModalProps> = ({
  isOpen,
  onClose,
  telegramHandle,
  telegramData,
}) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <TransitionChild as={Fragment}>
                    <DialogBackdrop
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition duration-300 data-closed:opacity-0"
                    />
                </TransitionChild>
    
                {/* Modal container */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    {/* Dialog panel */}
                    <TransitionChild as={Fragment}>
                        <DialogPanel
                            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl relative transition duration-300 data-closed:opacity-0 data-closed:scale-95"
                        >
                        <DialogTitle className="text-xl font-semibold mb-4 text-center">
                            Profile Details
                        </DialogTitle>
            
                        {/* Close button */}
                        <button
                            className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg"
                            onClick={onClose}
                        >
                            ×
                        </button>

                        {/* Display data if it exists */}
                        {telegramHandle ? (
                            telegramData ? (
                                <div className="text-sm text-gray-700 dark:text-gray-200">
                                    {/* Displaying structured data */}
                                    <div className="space-y-4">
                                        <div>
                                            <strong>Entries:</strong> {telegramData.entries}
                                        </div>
                                        <div>
                                            <strong>Text Contents:</strong> {telegramData.textContents}
                                        </div>
                                        <div>
                                            <strong>Caption Contents:</strong> {telegramData.captionContents}
                                        </div>
                                        <div>
                                            <strong>Entities:</strong> {telegramData.entities}
                                        </div>
                                        <div>
                                            <strong>Photos:</strong> {telegramData.photos}
                                        </div>
                                        <div>
                                            <strong>Voices:</strong> {telegramData.voices}
                                        </div>
                                        <div>
                                            <strong>Videos:</strong> {telegramData.videos}
                                        </div>
                                        <div>
                                            <strong>Video Notes:</strong> {telegramData.videoNotes}
                                        </div>
                                        <div>
                                            <strong>Chats:</strong> {telegramData.chats}
                                        </div>
                                    </div>
                                </div>
                                ) : (
                                <p className="text-center text-gray-500 dark:text-gray-300">
                                    Loading Telegram data…
                                </p>
                                )
                            ) : (
                                <p className="text-center text-gray-400 dark:text-gray-400">
                                    No Telegram handle found.
                                </p>
                                )}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
        </Transition>
    )
}

export default ProfilePopupModal;
