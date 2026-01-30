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
  const [searchTerm, setSearchTerm] = useState("");

  //  Cargar retiros paginados
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await retiroService.getProfile(page, 10);
        setRequests(res.data);
        setFilteredRequests(res.data);
        setMeta(res.meta);
      } catch (error) {
        console.error("Error al cargar los retiros:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [page]);

  // Búsqueda local
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRequests(requests);
      return;
    }

    const search = searchTerm.toLowerCase();

    const filtered = requests.filter((req) => {
      return (
        req.operation.referenceCode?.toLowerCase().includes(search) ||
        req.operation.user.firstName?.toLowerCase().includes(search) ||
        req.operation.user.lastName?.toLowerCase().includes(search) ||
        req.operation.user.email?.toLowerCase().includes(search) ||
        req.operation.currency?.toLowerCase().includes(search)
      );
    });

    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

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
      <div className="h-screen flex items-center justify-center text-white">
        Cargando retiros...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h1 className="text-3xl text-white mb-6 font-bold">
        Solicitudes de Retiro
      </h1>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {filteredRequests.length === 0 ? (
        <p className="text-white text-center mt-8">
          {searchTerm
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

      {/* 🔢 Paginación */}
      {meta && (
        <div className="flex justify-between items-center mt-6 text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span>
            Página {meta.page} de {meta.totalPages}
          </span>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
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