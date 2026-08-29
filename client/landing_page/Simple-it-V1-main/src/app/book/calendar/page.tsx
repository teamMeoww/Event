'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Globe,
    Clock,
    ArrowLeft,
    CheckCircle,
    Video
} from 'lucide-react';
import TransitionLink from '@/components/atoms/TransitionLink';
import NavItem from '@/components/molecules/NavItem';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CustomCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        details: ''
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day);
        // don't allow past dates
        if (newDate < new Date(new Date().setHours(0, 0, 0, 0))) return;

        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];
        const times: string[] = [];
        for (let i = 9; i <= 17; i++) {
            times.push(`${i.toString().padStart(2, '0')}:00`);
            times.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return times;
    }, [selectedDate]);

    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const submitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                name: formData.name,
                email: formData.email,
                subject: `New Calendar Booking: 30 Min Discovery`,
                message: `Booking Request Details:\n\nDate: ${selectedDate?.toDateString()}\nTime: ${selectedTime}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n\nAdditional Details:\n${formData.details}`
            };

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStep('success');
            } else {
                alert("Failed to submit booking. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] font-sans antialiased flex flex-col items-center pt-32 pb-20 px-4">
            <NavItem />

            <div className="w-full max-w-5xl mx-auto mb-6">
                <TransitionLink href="/book">
                    <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold transition-colors cursor-pointer w-fit">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Options
                    </div>
                </TransitionLink>
            </div>

            <div className="bg-white border border-zinc-200 shadow-xl rounded-3xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Sidebar Details */}
                <div className="w-full md:w-[35%] border-r border-zinc-200 bg-zinc-50/50 p-8 md:p-10 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-zinc-500 font-bold uppercase tracking-wider text-sm mb-2">Event App GenZ</h2>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-6">Discovery Call</h1>

                        <div className="flex flex-col gap-4 text-zinc-600 font-medium">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 opacity-70" />
                                <span>30 min</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 opacity-70" />
                                <span>Google Meet</span>
                            </div>
                        </div>

                        <p className="mt-8 text-zinc-500 leading-relaxed text-sm lg:text-base">
                            Dive deep into your project details. We will discuss your vision, potential timelines, and how our team can bring it to life.
                        </p>
                    </div>

                    {(selectedDate && selectedTime) && step !== 'success' && (
                        <div className="mt-auto pt-8 border-t border-zinc-200">
                            <div className="text-zinc-900 font-bold mb-1">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-zinc-500 font-medium">
                                {selectedTime} - {Intl.DateTimeFormat().resolvedOptions().timeZone}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Content Area */}
                <div className="w-full md:w-[65%] p-8 md:p-10 relative">
                    {step === 'calendar' && (
                        <div className="flex flex-col md:flex-row h-full w-full gap-6 md:gap-8">
                            {/* Main Calendar View */}
                            <div className={`flex-1 transition-all duration-300`}>
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-zinc-900">
                                        {monthName} {year}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrevMonth}
                                            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleNextMonth}
                                            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 mb-4">
                                    {DAYS_OF_WEEK.map((day) => (
                                        <div key={day} className="text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Empty cells before start of month */}
                                    {Array.from({ length: startingDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-12 w-full"></div>
                                    ))}

                                    {/* Day cells */}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dateObj = new Date(year, month, day);
                                        const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                                        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                                        const isToday = new Date().toDateString() === dateObj.toDateString();

                                        return (
                                            <div key={day} className="flex items-center justify-center h-14">
                                                <button
                                                    disabled={isPast}
                                                    onClick={() => handleDateClick(day)}
                                                    className={`
        relative w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-200
        ${isPast ? 'text-zinc-300 cursor-not-allowed' : 'hover:bg-zinc-100 cursor-pointer text-zinc-700'}
        ${isSelected ? '!bg-[#1a1a1a] !text-[#ecff33] shadow-md scale-110' : ''}
        ${isToday && !isSelected ? 'text-zinc-900 border-2 border-zinc-900 bg-transparent' : ''}
      `}
                                                >
                                                    {day}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 flex items-center gap-2 text-zinc-500 font-medium text-sm border-t border-zinc-100 pt-6">
                                    <Globe className="w-4 h-4" />
                                    Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                </div>
                            </div>

                            {/* Time Slot List - Only visible when date selected */}
                            {selectedDate && (
                                <div className="w-full md:w-[30%] md:min-w-[200px] md:border-l border-t md:border-t-0 border-zinc-100 pt-6 md:pt-0 md:pl-8 h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                                    <p className="font-medium text-zinc-500 mb-6">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </p>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-8 custom-scrollbar relative max-h-[480px]">
                                        {availableTimes.map((time) => (
                                            <div key={time} className="flex gap-2 items-center">
                                                <button
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`
                             flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all
                             ${selectedTime === time
                                                            ? 'border-zinc-900 bg-zinc-800 text-white shadow-md w-1/2'
                                                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 w-full'
                                                        }
                           `}
                                                >
                                                    {time}
                                                </button>
                                                {(selectedTime === time) && (
                                                    <button
                                                        onClick={() => setStep('form')}
                                                        className="flex-1 bg-zinc-900 text-[#ecff33] font-bold text-sm py-3 px-4 rounded-xl border border-zinc-900 hover:bg-zinc-800 transition-colors animate-in slide-in-from-right-2"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'form' && (
                        <div className="h-full flex flex-col animate-in fade-in duration-300 delay-100">
                            <button
                                onClick={() => setStep('calendar')}
                                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-bold transition-colors w-fit mb-8"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to calendar
                            </button>

                            <h3 className="text-2xl font-bold tracking-tight mb-8">Enter your details</h3>

                            <form onSubmit={submitBooking} className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Please share anything that will help prepare for our meeting.</label>
                                    <textarea
                                        rows={4}
                                        value={formData.details}
                                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-zinc-900 focus:bg-white transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-[#1a1a1a] hover:bg-black text-[#ecff33] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-[#ecff33] border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            'Schedule Event'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 max-w-sm mx-auto space-y-6">
                            <div className="w-20 h-20 bg-[#ecff33] rounded-full flex items-center justify-center shadow-lg text-zinc-900 mb-2">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-zinc-900">You're Scheduled!</h2>
                            <p className="text-zinc-500 text-lg">
                                A calendar invitation has been sent to your email address along with the Google Meet link.
                            </p>

                            <div className="w-full border border-zinc-200 rounded-2xl p-6 text-left space-y-4 bg-zinc-50 mt-4">
                                <div className="font-bold text-zinc-900 border-b border-zinc-200 pb-4">
                                    Discovery Call
                                </div>
                                <div className="space-y-2 text-zinc-600 font-medium">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-zinc-400" />
                                        {selectedTime}
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Video className="w-5 h-5 text-zinc-400 mt-1" />
                                        Guest joining details will be sent to {formData.email}
                                    </div>
                                </div>
                            </div>

                            <TransitionLink href="/">
                                <button className="mt-8 text-zinc-500 hover:text-zinc-900 font-bold border-b-2 border-transparent hover:border-zinc-900 transition-colors pb-1">
                                    Return to Homepage
                                </button>
                            </TransitionLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom styles for right sidebar scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e4e4e7;
          border-radius: 20px;
        }
      `}} />
        </div>
    );
}
