import AddressItem from "./AddressItem";

export default function AddressBlock({ trackingData }: any) {
  return (
    <div className="flex max-md:flex-col md:gap-8 gap-3 justify-center">
      {/* Sender */}
      <AddressItem
        label="Alamat pengirim"
        value={trackingData.origin}
        icon="user"
      />

      {/* Receiver */}
      <AddressItem
        label="Alamat penerima"
        value={trackingData.destination}
        icon="location"
      />
    </div>
  );
}