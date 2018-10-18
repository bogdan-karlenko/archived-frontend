export interface IProvider {
    name: String;
    devices: String[];
    address: String;
    website: String;
    phone: String;
    email: String;
    doctors: String[];
    coordinates: {
        lat: Number;
        lng: Number
    };
    source: String;
    createdAt: Date;
    updatedAt: Date;
}
