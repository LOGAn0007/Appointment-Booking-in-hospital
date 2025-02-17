import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Myappointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // Refresh appointments list
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token && backendUrl) {
      getUserAppointments();
    }
  }, [token, backendUrl]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length > 0 ? (
        <div>
          {appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData?.image || ""}
                  alt={item.docData?.name || "Doctor"}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData?.name || "Unknown Doctor"}
                </p>
                <p>{item.docData?.speciality || "No speciality provided"}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData?.address?.line1 || ""}</p>
                <p className="text-xs">{item.docData?.address?.line2 || ""}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {item.slotDate
                    ? slotDateFormat(item.slotDate)
                    : "Unknown Date"}{" "}
                  | {item.slotTime || "Unknown Time"}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled ? (
                  <>
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-primary transition-all duration-300">
                      Pay Online
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-red-600 transition-all duration-300"
                    >
                      Cancel appointment
                    </button>
                  </>
                ) : (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default Myappointments;
