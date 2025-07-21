import { useState } from "react";
// @ts-expect-error events interface import
import { updateEvents } from "../../api/events"

interface Event {
  _id: string;
  title: string;
  content: string;
  startTime: string; 
  endTime: string;
  recurring: boolean;
  userId: string; 
  sharedEmails: string[];
  color: number; 
  recurDays: number[];
  recurEnd: string; 
}

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onSave: () => void;
}

export const EditEventModal = ({ event, onClose, onSave } : EditEventModalProps) => {
    const toLocalDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    };

    const [title, setTitle] = useState(event.title);
    const [startTime, setStartTime] = useState(toLocalDateTime(event.startTime));
    const [endTime, setEndTime] = useState(toLocalDateTime(event.endTime));

    const handleSubmit = async () => {
        try {            
            const updateData = {
                eventId: event._id,
                title,
                startTime,
                endTime,
            };
            await updateEvents(event._id, updateData);
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-onparOrange p-4 rounded-lg">
                <h2 className="font-bold text-lg">Edit Event</h2>
                <input className="bg-onparLightYellow block my-2 border p-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="datetime-local" className="bg-onparLightYellow block my-2 border p-1" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <input type="datetime-local" className="bg-onparLightYellow block my-2 border p-1" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                <button className="mr-2 text-black bg-green-600 px-3 py-1 rounded" onClick={handleSubmit}>Save</button>
                <button className="text-white bg-gray-500 px-3 py-1 rounded" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};