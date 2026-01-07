// Pages/UserKyc.jsx
import { useForm, Head } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import SmartDocumentPicker from "../../Components/SmartDocumentPicker";
import React, { memo } from "react";

// Memoized picker to prevent unnecessary re-renders
const MemoPicker = memo(SmartDocumentPicker);

export default function UserKyc() {
  const { data, setData, post, processing, errors } = useForm({
    passport_photo: null,
    id_card_front: null,
    id_card_back: null,
    proof_of_address: null,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("kyc.submit"), {
      forceFormData: true,
    });
  };

  return (
    <>
      <Head title="KYC Verification" />

      <div className="max-w-4xl mx-auto py-10 page">
        <div className="bg-[var(--color-primary-light)] shadow-xl rounded-2xl p-8">
          <h1 className="text-[var(--color-primary)] text-2xl font-bold mb-2">
            KYC Verification
          </h1>

          <p className="text-sm text-muted mb-6">
            Please upload clear and valid documents. KYC must be approved
            before loans can be granted.
          </p>

          <form onSubmit={submit} className="space-y-6">
            {/* Passport / Profile Photo */}
            <MemoPicker
              key="passport"
              label="Passport / Profile Photo"
              file={data.passport_photo}
              onChange={(file) => setData("passport_photo", file)}
            />
            {errors.passport_photo && (
              <p className="text-danger text-sm">{errors.passport_photo}</p>
            )}

            {/* ID Card Front / Back */}
            <div className="grid md:grid-cols-2 gap-4">
              <MemoPicker
                key="id_front"
                label="ID Card Front"
                file={data.id_card_front}
                onChange={(file) => setData("id_card_front", file)}
              />
              <MemoPicker
                key="id_back"
                label="ID Card Back"
                file={data.id_card_back}
                onChange={(file) => setData("id_card_back", file)}
              />
            </div>
            {errors.id_card_front && (
              <p className="text-danger text-sm">{errors.id_card_front}</p>
            )}
            {errors.id_card_back && (
              <p className="text-danger text-sm">{errors.id_card_back}</p>
            )}

            {/* Proof of Address */}
            <MemoPicker
              key="proof_address"
              label="Proof of Address (Utility bill, etc.)"
              file={data.proof_of_address}
              onChange={(file) => setData("proof_of_address", file)}
            />
            {errors.proof_of_address && (
              <p className="text-danger text-sm">{errors.proof_of_address}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold transition"
              style={{
                backgroundColor: "var(--color-primary)",
                opacity: processing ? 0.7 : 1,
                cursor: processing ? "not-allowed" : "pointer",
              }}
              disabled={processing}
            >
              {processing ? "Submitting..." : "Submit KYC"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// Layout wrapper
UserKyc.layout = (page) => <AppLayout>{page}</AppLayout>;
