"use client";

import { useState } from "react";

type SearchBarProps = {
  searchByCode: string;
  searchByUser: string;
  onSearchByCodeChange: (value: string) => void;
  onSearchByUserChange: (value: string) => void;
};

export default function SearchBar({ 
  searchByCode, 
  searchByUser, 
  onSearchByCodeChange, 
  onSearchByUserChange 
}: SearchBarProps) {
  const [localCodeSearch, setLocalCodeSearch] = useState(searchByCode);
  const [localUserSearch, setLocalUserSearch] = useState(searchByUser);

  const handleCodeSearch = () => {
    onSearchByCodeChange(localCodeSearch.trim());
  };

  const handleUserSearch = () => {
    onSearchByUserChange(localUserSearch.trim());
  };

  const handleCodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCodeSearch();
    }
  };

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUserSearch();
    }
  };

  const handleClearCode = () => {
    setLocalCodeSearch("");
    onSearchByCodeChange("");
  };

  const handleClearUser = () => {
    setLocalUserSearch("");
    onSearchByUserChange("");
  };

  const handleClearAll = () => {
    setLocalCodeSearch("");
    setLocalUserSearch("");
    onSearchByCodeChange("");
    onSearchByUserChange("");
  };

  const hasAnySearch = searchByCode || searchByUser;

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-start">

        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por cod de retiro..."
              value={localCodeSearch}
              onChange={(e) => setLocalCodeSearch(e.target.value)}
              onKeyPress={handleCodeKeyPress}
              className="w-full px-3 py-2.5 pl-10 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            onClick={handleCodeSearch}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Buscar
          </button>

          {searchByCode && (
            <button
              onClick={handleClearCode}
              className="px-3 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              title="Limpiar búsqueda por código"
            >
              ✕
            </button>
          )}
        </div>


        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre de usuario..."
              value={localUserSearch}
              onChange={(e) => setLocalUserSearch(e.target.value)}
              onKeyPress={handleUserKeyPress}
              className="w-full px-3 py-2.5 pl-10 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <button
            onClick={handleUserSearch}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            Buscar
          </button>

          {searchByUser && (
            <button
              onClick={handleClearUser}
              className="px-3 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              title="Limpiar búsqueda por usuario"
            >
              ✕
            </button>
          )}
        </div>


        {hasAnySearch && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap lg:w-auto w-full"
            title="Limpiar todas las búsquedas"
          >
            Limpiar Todo
          </button>
        )}
      </div>
    </div>
  );
}