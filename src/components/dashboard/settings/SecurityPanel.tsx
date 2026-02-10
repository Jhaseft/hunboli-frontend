"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { walletService } from "@/services/wallet.service";
import { PasswordRequirements, isPasswordValid } from "@/components/ui/PasswordRequirements";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function SecurityPanel() {
  const { user, refreshUser } = useAuth();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const walletAddress = user?.walletAddress;
  const hasWallet = !!walletAddress;

  const formatWalletAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Seguridad</h1>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* Bloque 1: Contraseña */}
        <PasswordSection
          isOpen={isChangePasswordOpen}
          onToggle={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
        />

        {/* Bloque 2: Billetera Vinculada */}
        <WalletSection
          walletAddress={walletAddress}
          hasWallet={hasWallet}
          formatAddress={formatWalletAddress}
          onWalletLinked={refreshUser}
        />
      </div>
    </section>
  );
}

// ============================================
// Bloque 1: Contraseña
// ============================================
function PasswordSection({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isNewPasswordValid = isPasswordValid(newPassword);
  const canSubmit = currentPassword && newPassword && confirmPassword && passwordsMatch && isNewPasswordValid;

  const handleChangePassword = async () => {
    setError(null);

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isNewPasswordValid) {
      setError("La contraseña no cumple con los requisitos");
      return;
    }

    setIsLoading(true);
    try {
      await userService.editPassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccess(false);
        onToggle();
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    onToggle();
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0f1e33] overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-gray-800 bg-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <LockIcon className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Contraseña</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Protege tu cuenta con una contraseña segura
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {!isOpen ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-500" />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-teal-400 hover:bg-teal-500/10 border border-teal-500/30 transition"
            >
              <EditIcon className="w-4 h-4" />
              Cambiar Contraseña
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <PasswordInput
              label="Contraseña actual"
              value={currentPassword}
              onChange={(v) => { setCurrentPassword(v); setError(null); }}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="Ingresa tu contraseña actual"
            />
            <PasswordInput
              label="Nueva contraseña"
              value={newPassword}
              onChange={(v) => { setNewPassword(v); setError(null); }}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword(!showNewPassword)}
              placeholder="Ingresa tu nueva contraseña"
            />

            {/* Requisitos de contraseña */}
            {newPassword && (
              <PasswordRequirements password={newPassword} />
            )}

            <PasswordInput
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setError(null); }}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirma tu nueva contraseña"
            />

            {/* Indicador de coincidencia */}
            {confirmPassword && (
              <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                {passwordsMatch ? <CheckIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                <span>{passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm text-emerald-400">Contraseña actualizada correctamente</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isLoading || !canSubmit}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Guardando...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Guardar Contraseña
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-2.5 pr-12 text-gray-100 text-sm placeholder:text-gray-600 outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 transition"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

// ============================================
// Bloque 2: Billetera Vinculada
// ============================================
type WalletStep = 'idle' | 'confirm-change' | 'connecting' | 'password';

function WalletSection({
  walletAddress,
  hasWallet,
  formatAddress,
  onWalletLinked,
}: {
  walletAddress: string | null | undefined;
  hasWallet: boolean;
  formatAddress: (address: string) => string;
  onWalletLinked: () => Promise<void>;
}) {
  const [step, setStep] = useState<WalletStep>('idle');
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConnectorModal, setShowConnectorModal] = useState(false);

  // Hooks de wagmi para manejar la conexión de wallets
  const { connectors: allConnectors, connect } = useConnect();
  const { address: connectedAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Filtrar conectores duplicados por nombre
  const connectors = allConnectors.filter(
    (connector, index, self) =>
      index === self.findIndex((c) => c.name === connector.name)
  );

  const resetState = () => {
    setStep('idle');
    setPendingWalletAddress(null);
    setPassword("");
    setShowPassword(false);
    setError(null);
    setSuccess(false);
    setShowConnectorModal(false);
    // Desconectar la wallet temporal si hay alguna conectada
    if (isConnected && !hasWallet) {
      disconnect();
    }
  };

  // Detectar cuando se conecta una wallet
  useEffect(() => {
    if (isConnected && connectedAddress && step === 'connecting') {
      const newAddress = connectedAddress.toLowerCase();
      const currentAddress = walletAddress?.toLowerCase();

      console.log('Nueva wallet conectada:', newAddress);
      console.log('Wallet actual (Backend):', currentAddress);

      // Verificar si es la misma wallet
      if (hasWallet && newAddress === currentAddress) {
        setError("Esta es la misma billetera que ya tienes vinculada. Selecciona una billetera diferente.");
        disconnect();
        setStep('idle');
        return;
      }

      setPendingWalletAddress(newAddress);
      setStep('password');
    }
  }, [isConnected, connectedAddress, step, walletAddress, hasWallet, disconnect]);

  const handleConnectorSelect = async (connectorId: string) => {
    setStep('connecting');
    setError(null);
    setShowConnectorModal(false);

    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) {
        throw new Error("Conector no encontrado");
      }

      await connect({ connector });
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Error al conectar la billetera");
      setStep('idle');
    }
  };

  const startWalletConnection = () => {
    setShowConnectorModal(true);
    setError(null);
  };

  const handleLinkWallet = async () => {
    if (!pendingWalletAddress || !password) return;

    setIsLoading(true);
    setError(null);

    console.log('Enviando al backend:', { walletAddress: pendingWalletAddress });

    try {
      await walletService.linkWallet(pendingWalletAddress, password);
      setSuccess(true);
      await onWalletLinked();
      setTimeout(() => {
        resetState();
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al vincular la billetera");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChange = () => {
    setStep('confirm-change');
  };

  const handleConfirmChange = () => {
    startWalletConnection();
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0f1e33] overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-gray-800 bg-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <WalletIcon className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Billetera Vinculada (Web3)</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Esta es la dirección usada para tus depósitos
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Mensaje de éxito */}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <p className="text-sm text-emerald-400">Billetera vinculada correctamente</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {hasWallet ? (
          <div className="space-y-4">
            {/* Wallet Address Display */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                <FoxIcon />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-gray-200">
                  {formatAddress(walletAddress!)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckIcon className="w-3 h-3" />
                Activa
              </span>
            </div>

            {/* Step: Idle - Show change button */}
            {step === 'idle' && (
              <button
                type="button"
                onClick={handleStartChange}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/30 transition"
              >
                <RefreshIcon className="w-4 h-4" />
                Cambiar Billetera
              </button>
            )}

            {/* Step: Confirm change */}
            {step === 'confirm-change' && !showConnectorModal && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <WarningIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      ¿Estás seguro de cambiar tu billetera?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Selecciona una billetera para conectar tu nueva dirección.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={resetState}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmChange}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition"
                  >
                    <WalletIcon className="w-4 h-4" />
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Selector de conectores (cuando se cambia la wallet) */}
            {step === 'confirm-change' && showConnectorModal && (
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white">Selecciona tu billetera</h4>
                  <button
                    type="button"
                    onClick={resetState}
                    className="text-gray-400 hover:text-gray-300 transition"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Elige cómo quieres conectar tu billetera. En móvil, usa WalletConnect para conectar apps como MetaMask móvil.
                </p>
                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      type="button"
                      onClick={() => handleConnectorSelect(connector.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-900/80 transition text-left"
                    >
                      {connector.id === 'metaMask' || connector.id === 'io.metamask' ? (
                        <FoxIcon />
                      ) : connector.id === 'walletConnect' ? (
                        <WalletConnectIcon />
                      ) : (
                        <WalletIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{connector.name}</p>
                        {connector.id === 'walletConnect' && (
                          <p className="text-xs text-gray-500 mt-0.5">Recomendado para móviles</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Connecting */}
            {step === 'connecting' && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <div className="flex items-center gap-3">
                  <LoadingSpinner />
                  <p className="text-sm text-orange-400">Conectando billetera...</p>
                </div>
              </div>
            )}

            {/* Step: Password */}
            {step === 'password' && pendingWalletAddress && (
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Nueva billetera a vincular:</p>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                    <FoxIcon />
                    <span className="font-mono text-sm text-orange-400">
                      {formatAddress(pendingWalletAddress)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Confirma tu contraseña para continuar
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="Ingresa tu contraseña"
                      className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-2.5 pr-12 text-gray-100 text-sm placeholder:text-gray-600 outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={resetState}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleLinkWallet}
                    disabled={isLoading || !password}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Vinculando...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Vincular Billetera
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {step === 'idle' && !showConnectorModal && (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <WalletIcon className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  No tienes ninguna billetera vinculada
                </p>
                <button
                  type="button"
                  onClick={startWalletConnection}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition"
                >
                  <WalletIcon className="w-5 h-5" />
                  Conectar Billetera
                </button>
              </div>
            )}

            {/* Selector de conectores */}
            {showConnectorModal && (
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white">Selecciona tu billetera</h4>
                  <button
                    type="button"
                    onClick={() => setShowConnectorModal(false)}
                    className="text-gray-400 hover:text-gray-300 transition"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Elige cómo quieres conectar tu billetera. En móvil, usa WalletConnect para conectar apps como MetaMask móvil.
                </p>
                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      type="button"
                      onClick={() => handleConnectorSelect(connector.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-900/80 transition text-left"
                    >
                      {connector.id === 'metaMask' || connector.id === 'io.metamask' ? (
                        <FoxIcon />
                      ) : connector.id === 'walletConnect' ? (
                        <WalletConnectIcon />
                      ) : (
                        <WalletIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{connector.name}</p>
                        {connector.id === 'walletConnect' && (
                          <p className="text-xs text-gray-500 mt-0.5">Recomendado para móviles</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Connecting */}
            {step === 'connecting' && (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <LoadingSpinner />
                </div>
                <p className="text-sm text-orange-400">Conectando billetera...</p>
              </div>
            )}

            {/* Step: Password */}
            {step === 'password' && pendingWalletAddress && (
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Billetera a vincular:</p>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                    <FoxIcon />
                    <span className="font-mono text-sm text-orange-400">
                      {formatAddress(pendingWalletAddress)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Confirma tu contraseña para continuar
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="Ingresa tu contraseña"
                      className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-2.5 pr-12 text-gray-100 text-sm placeholder:text-gray-600 outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={resetState}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleLinkWallet}
                    disabled={isLoading || !password}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        Vinculando...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4" />
                        Vincular Billetera
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Icons
// ============================================
function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function EditIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function WalletIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function FoxIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M20.5 3L12 8.5L14.5 5L20.5 3Z" fill="#E17726" stroke="#E17726" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 3L11.9 8.55L9.5 5L3.5 3Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 16.5L15.5 19.5L20 20.75L21.25 16.6L17.5 16.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.75 16.6L4 20.75L8.5 19.5L6.5 16.5L2.75 16.6Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.25 10.5L7 12.25L11.5 12.5L11.35 7.75L8.25 10.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 10.5L12.6 7.7L12.5 12.5L17 12.25L15.75 10.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 19.5L11.25 18.15L8.9 16.65L8.5 19.5Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.75 18.15L15.5 19.5L15.1 16.65L12.75 18.15Z" fill="#E27625" stroke="#E27625" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function RefreshIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function WarningIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function LinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 300 185" fill="none">
      <path d="M61.439 36.256c48.91-47.888 128.212-47.888 177.123 0l5.886 5.764a6.041 6.041 0 0 1 0 8.67l-20.136 19.716a3.179 3.179 0 0 1-4.428 0l-8.101-7.931c-34.122-33.408-89.444-33.408-123.566 0l-8.675 8.494a3.179 3.179 0 0 1-4.428 0L54.978 51.253a6.041 6.041 0 0 1 0-8.67l6.46-6.327ZM280.206 77.03l17.922 17.547a6.041 6.041 0 0 1 0 8.67l-80.81 79.122c-2.446 2.394-6.41 2.394-8.856 0l-57.354-56.155a1.59 1.59 0 0 0-2.214 0L91.54 182.37c-2.446 2.394-6.411 2.394-8.857 0L1.872 103.247a6.041 6.041 0 0 1 0-8.671l17.922-17.547c2.445-2.394 6.41-2.394 8.856 0l57.355 56.155a1.59 1.59 0 0 0 2.214 0L145.572 77.03c2.446-2.394 6.41-2.395 8.856 0l57.355 56.155a1.59 1.59 0 0 0 2.214 0L271.35 77.03c2.446-2.394 6.41-2.394 8.856 0Z" fill="#3B99FC"/>
    </svg>
  );
}
