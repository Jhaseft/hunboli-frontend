"use client";

import { useState, useEffect } from "react";
import { retiroService } from "@/services/retiro.service";
import SearchBar from "@/components/admin/redeem/SearchBar";
import RedeemTable from "@/components/admin/redeem/RedeemTable";
import DetailModal from "@/components/admin/redeem/DetailModal";
import EditModal from "@/components/admin/redeem/EditModal";
import { RedeemRequest } from "@/components/admin/redeem/redeem.types";

type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function AdminRedeemPage() {
  const [requests, setRequests] = useState<RedeemRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RedeemRequest[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<RedeemRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados separados para cada tipo de búsqueda
  const [searchByCode, setSearchByCode] = useState("");
  const [searchByUser, setSearchByUser] = useState("");

  // Cargar datos cada vez que cambien los filtros o la página
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const hasSearch = searchByCode || searchByUser;
        
        if (!hasSearch) {
          // Sin búsqueda: cargar página normal con paginación
          const res = await retiroService.getProfile(page, 10);
          setRequests(res.data);
          setFilteredRequests(res.data);
          setMeta(res.meta);
        } else {
          // Con búsqueda: buscar en backend (sin paginación)
          const res = await retiroService.searchBurns(
            searchByCode || undefined, 
            searchByUser || undefined
          );
          setFilteredRequests(res);
          setRequests(res);
          setMeta(null);
        }
      } catch (error) {
        console.error("Error al cargar retiros:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchByCode, searchByUser, page]);

  // Manejar cambio de búsqueda por código y resetear página
  const handleSearchByCodeChange = (newSearchTerm: string) => {
    setSearchByCode(newSearchTerm);
    setPage(1);
  };

  // Manejar cambio de búsqueda por usuario y resetear página
  const handleSearchByUserChange = (newSearchTerm: string) => {
    setSearchByUser(newSearchTerm);
    setPage(1);
  };

  const handleViewDetail = (request: RedeemRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleEdit = (request: RedeemRequest) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData: {
    status: string;
    payoutTxRef: string;
    file?: File;
  }) => {
    if (!selectedRequest) return;

    try {
      await retiroService.updateWithdrawal(selectedRequest.id, updatedData);

      const updatedRequests = requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              payoutTxRef: updatedData.payoutTxRef,
              operation: {
                ...req.operation,
                status: updatedData.status,
              },
            }
          : req
      );

      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
      setShowEditModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error al actualizar el retiro:", error);
      alert("Error al actualizar el retiro");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400" />
      </div>
    );
  }

  const hasAnySearch = searchByCode || searchByUser;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl lg:text-3xl text-white mb-6 font-bold">
        Solicitudes de Retiro
      </h1>

      <SearchBar 
        searchByCode={searchByCode}
        searchByUser={searchByUser}
        onSearchByCodeChange={handleSearchByCodeChange}
        onSearchByUserChange={handleSearchByUserChange}
      />

      {filteredRequests.length === 0 ? (
        <p className="text-white text-center mt-8">
          {hasAnySearch
            ? "No se encontraron resultados"
            : "No hay solicitudes pendientes"}
        </p>
      ) : (
        <RedeemTable
          requests={filteredRequests}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
        />
      )}


      {meta && !hasAnySearch && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Anterior
          </button>

          <span className="text-sm">
            Página {meta.page} de {meta.totalPages}
          </span>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Siguiente
          </button>
        </div>
      )}

      {showDetailModal && selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showEditModal && selectedRequest && (
        <EditModal
          request={selectedRequest}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}