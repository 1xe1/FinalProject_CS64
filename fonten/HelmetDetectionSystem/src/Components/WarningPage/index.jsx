import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaTrash, FaCalendarAlt, FaCheckSquare } from 'react-icons/fa';

const WarningPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set default start and end times for the current day
  const now = new Date();
  const thailandOffset = 7 * 60; // 7 hours in minutes
  const thailandTime = new Date(now.getTime() + (thailandOffset - now.getTimezoneOffset()) * 60000);
  const startOfDay = new Date(thailandTime.getFullYear(), thailandTime.getMonth(), thailandTime.getDate(), 0, 0, 0);
  const [endDateTime, setEndDateTime] = useState(thailandTime.toISOString().slice(0, 16));
  const [startDateTime, setStartDateTime] = useState(startOfDay.toISOString().slice(0, 16));

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.filter((url) => {
    const fileName = url.split('/').pop();
    const dateTimeString = fileName.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
    if (dateTimeString) {
      const [datePart, timePart] = dateTimeString[0].split('_');
      const dateTime = new Date(`${datePart}T${timePart.replace(/-/g, ':')}`);
      const start = startDateTime ? new Date(startDateTime) : null;
      const end = endDateTime ? new Date(endDateTime) : null;

      return (!start || dateTime >= start) && (!end || dateTime <= end);
    }
    return false;
  }).slice(indexOfFirstImage, indexOfLastImage);

  const totalPages = Math.ceil(images.filter((url) => {
    const fileName = url.split('/').pop();
    const dateTimeString = fileName.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
    if (dateTimeString) {
      const [datePart, timePart] = dateTimeString[0].split('_');
      const dateTime = new Date(`${datePart}T${timePart.replace(/-/g, ':')}`);
      const start = startDateTime ? new Date(startDateTime) : null;
      const end = endDateTime ? new Date(endDateTime) : null;

      return (!start || dateTime >= start) && (!end || dateTime <= end);
    }
    return false;
  }).length / imagesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [selectedImages, setSelectedImages] = useState(new Set());

  const deleteImages = async (imagesToDelete) => {
    try {
      for (const imageUrl of imagesToDelete) {
        const filename = imageUrl.split('/').pop();
        const response = await fetch(
          `http://localhost:3000/api/warning-images/${filename}`,
          { method: 'DELETE' }
        );
        if (!response.ok) throw new Error(`Failed to delete ${filename}`);
      }
      
      // Refresh images list
      setImages(images.filter(img => !imagesToDelete.includes(img)));
      setSelectedImages(new Set());
      toast.success('ลบรูปภาพเรียบร้อยแล้ว');
    } catch (err) {
      toast.error('เกิดข้อผิดพลาดในการลบรูปภาพ');
    }
  };

  const deleteImagesByDateRange = () => {
    const imagesToDelete = images.filter((url) => {
      const fileName = url.split('/').pop();
      const dateTimeString = fileName.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
      if (dateTimeString) {
        const [datePart, timePart] = dateTimeString[0].split('_');
        const dateTime = new Date(`${datePart}T${timePart.replace(/-/g, ':')}`);
        const start = startDateTime ? new Date(startDateTime) : null;
        const end = endDateTime ? new Date(endDateTime) : null;
        return (!start || dateTime >= start) && (!end || dateTime <= end);
      }
      return false;
    });
    
    if (window.confirm(`ต้องการลบรูปภาพทั้งหมด ${imagesToDelete.length} รูปในช่วงเวลาที่เลือกหรือไม่?`)) {
      deleteImages(imagesToDelete);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/warning-images"
        );
        if (!response.ok) throw new Error("Failed to fetch images");

        const imageFiles = await response.json();
        const imageUrls = imageFiles.map(
          (file) => `http://localhost:3000/images/${file}`
        );

        // Sort images by date in descending order
        imageUrls.sort((a, b) => {
          const getDateFromUrl = (url) => {
            const fileName = url.split('/').pop();
            const dateTimeString = fileName.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
            if (dateTimeString) {
              const [datePart, timePart] = dateTimeString[0].split('_');
              return new Date(`${datePart}T${timePart.replace(/-/g, ':')}`);
            }
            return new Date(0); // Default to epoch if no date found
          };

          return getDateFromUrl(b) - getDateFromUrl(a);
        });

        setImages(imageUrls);
      } catch (err) {
        setError("Failed to load images");
        toast.error("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <div>Loading images...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-2xl p-10 mb-12 w-full max-w-4xl mx-auto grid grid-cols-3">
        <div className="flex items-center col-span-3 justify-center">
          <svg
            className="w-14 h-14 text-red-600 mr-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-3xl text-center font-extrabold text-red-800">
            เฝ้าระวังอันตราย 
            <p>( ตรวจไม่พบป้ายทะเบียน )</p>
          </h1>
          
        </div>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-8">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">จากวันที่และเวลา</label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">ถึงวันที่และเวลา</label>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        
        <div className="flex gap-4 mt-4 w-full justify-center">
          <button
            onClick={deleteImagesByDateRange}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 flex items-center gap-2"
          >
            <FaTrash /> ลบรูปภาพตามช่วงเวลา
          </button>
          
          {selectedImages.size > 0 && (
            <button
              onClick={() => deleteImages([...selectedImages])}
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 flex items-center gap-2"
            >
              <FaTrash /> ลบรูปที่เลือก ({selectedImages.size})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {currentImages.map((url, index) => {
          const fileName = url.split('/').pop();
          const dateTimeString = fileName.match(/\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
          
          if (dateTimeString) {
            const [datePart, timePart] = dateTimeString[0].split('_');
            const time = timePart.replace(/-/g, ':');
            const isSelected = selectedImages.has(url);

            return (
              <div 
                key={index} 
                className={`rounded-2xl overflow-hidden shadow-xl border-2 p-8 bg-white transform transition duration-500 hover:scale-105 relative
                  ${isSelected ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => {
                  const newSelected = new Set(selectedImages);
                  if (isSelected) {
                    newSelected.delete(url);
                  } else {
                    newSelected.add(url);
                  }
                  setSelectedImages(newSelected);
                }}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-blue-500 text-2xl">
                    <FaCheckSquare />
                  </div>
                )}
                <Zoom>
                  <img
                    src={url}
                    alt={`Warning ${index + 1}`}
                    className="w-full h-64 object-cover mb-5 rounded-lg"
                  />
                </Zoom>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>วันที่: {datePart} เวลา: {time}</span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-4 mx-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          ก่อนหน้า
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-6 py-4 mx-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default WarningPage;
