import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { getClientSocket } from '../../utils/socket';
import { User, Award, CheckCircle } from 'lucide-react';

const SeatingPlanner = ({ eventId, currentMemberId }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSeat, setBookingSeat] = useState(null);

  // Generate 6 tables with 6 seats each
  const totalTables = 6;
  const seatsPerTable = 6;

  const fetchSeating = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const res = await api.get(`/events/${eventId}/seating`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSeats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch event seating:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeating();

    // Listen to real-time socket events for seat booking updates
    const socket = getClientSocket();
    if (socket) {
      const handleRealtimeSeat = (payload) => {
        if (payload.eventId === eventId) {
          setSeats(prev => {
            // Replace or insert seat
            const index = prev.findIndex(
              s => s.tableNumber === payload.seat.tableNumber && s.seatNumber === payload.seat.seatNumber
            );
            if (index > -1) {
              const updated = [...prev];
              updated[index] = payload.seat;
              return updated;
            }
            return [...prev, payload.seat];
          });
        }
      };

      socket.on('seat_booked', handleRealtimeSeat);
      return () => {
        socket.off('seat_booked', handleRealtimeSeat);
      };
    }
  }, [eventId]);

  const handleBookSeat = async (tableNumber, seatNumber) => {
    try {
      setError('');
      setBookingSeat({ tableNumber, seatNumber });
      const token = localStorage.getItem('accessToken');
      const res = await api.post(
        `/events/${eventId}/seating/book`,
        { tableNumber, seatNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSeats(prev => [...prev, res.data.data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book seat');
    } finally {
      setBookingSeat(null);
    }
  };

  const getSeatStatus = (tableNumber, seatNumber) => {
    const seat = seats.find(s => s.tableNumber === tableNumber && s.seatNumber === seatNumber);
    if (!seat) return { status: 'available', details: null };
    
    if (currentMemberId && seat.occupiedBy === currentMemberId) {
      return { status: 'mine', details: seat };
    }
    return { status: 'occupied', details: seat };
  };

  if (loading) {
    return <div className="text-center py-6 text-xs text-gray-500 font-bn">আসন বিন্যাস লোড হচ্ছে...</div>;
  }

  // Find user's booked seat (if any)
  const myBooking = seats.find(s => currentMemberId && s.occupiedBy === currentMemberId);

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4">
        <div>
          <h4 className="text-sm font-bold text-primary font-bn">ইন্টারেক্টিভ আসন বিন্যাস (Interactive Table Seating)</h4>
          <p className="text-xxs text-gray-500 font-bn mt-0.5">আপনার ব্যাচমেটদের সাথে বসার জন্য পছন্দের টেবিল এবং আসন নির্বাচন করুন।</p>
        </div>
        {myBooking && (
          <div className="bg-emerald-50 text-emerald-700 text-xxs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center space-x-1.5 self-start">
            <CheckCircle size={14} />
            <span>Booked: Table {myBooking.tableNumber}, Seat {myBooking.seatNumber}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700">
          {error}
        </div>
      )}

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
        {Array.from({ length: totalTables }).map((_, tableIdx) => {
          const tableNumber = tableIdx + 1;
          return (
            <div key={tableNumber} className="bg-white p-5 rounded-2xl border border-gray-250/60 shadow-xs flex flex-col items-center justify-center space-y-4 relative">
              <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase text-gray-400">T-{tableNumber}</span>
              
              {/* Circular Table */}
              <div className="w-20 h-20 bg-primary/10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm shadow-inner relative">
                Table {tableNumber}
              </div>

              {/* Seats Array around the table */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[200px] justify-center">
                {Array.from({ length: seatsPerTable }).map((_, seatIdx) => {
                  const seatNumber = seatIdx + 1;
                  const { status, details } = getSeatStatus(tableNumber, seatNumber);
                  
                  let buttonStyle = 'bg-white text-primary border-gray-300 hover:bg-slate-50';
                  let tooltipText = `Table ${tableNumber}, Seat ${seatNumber} (Available)`;
                  
                  if (status === 'mine') {
                    buttonStyle = 'bg-secondary text-white border-secondary shadow-md scale-105';
                    tooltipText = `Your Seat: Table ${tableNumber}, Seat ${seatNumber}`;
                  } else if (status === 'occupied') {
                    buttonStyle = 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed';
                    tooltipText = `${details.occupiedByName} (Batch: ${details.batch})`;
                  }

                  const isThisBooking = bookingSeat?.tableNumber === tableNumber && bookingSeat?.seatNumber === seatNumber;

                  return (
                    <div key={seatNumber} className="relative group flex justify-center">
                      <button
                        type="button"
                        disabled={status === 'occupied' || !!myBooking || isThisBooking}
                        onClick={() => handleBookSeat(tableNumber, seatNumber)}
                        className={`w-10 h-10 rounded-lg border text-xs font-bold transition flex items-center justify-center ${buttonStyle}`}
                      >
                        {isThisBooking ? (
                          <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          seatNumber
                        )}
                      </button>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {tooltipText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-[10px] text-gray-500 font-bold border-t border-gray-150 pt-4">
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-white border border-gray-300"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-gray-200 border border-gray-200"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-secondary"></div>
          <span>Your Seat</span>
        </div>
      </div>
    </div>
  );
};

export default SeatingPlanner;
