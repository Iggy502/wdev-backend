import axios from 'axios';
import {injectable} from 'tsyringe';
import {IAddress} from '../models/interfaces';
import {InternalServerError, NotFound} from "http-errors";

@injectable()
export class GeocodingService {
    private readonly baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    private readonly accessToken: string;

    constructor() {
        this.accessToken = process.env.MAPBOX_ACCESS_TOKEN || '';
        if (!this.accessToken) {
            throw new Error('MAPBOX_ACCESS_TOKEN is required');
        }
    }

    async getCoordinates(address: Partial<IAddress>): Promise<{ latitude: number; longitude: number }> {
        try {
            const addressString = this.formatAddress(address);
            const encodedAddress = encodeURIComponent(addressString);

            const url = `${this.baseUrl}/${encodedAddress}.json?access_token=${this.accessToken}`;
            const response = await axios.get(url);

            if (!response.data.features || response.data.features.length === 0) {
                throw NotFound('Address not found');
            }

            const [longitude, latitude] = response.data.features[0].center;
            return {latitude, longitude};
        } catch (error) {
            console.error('Geocoding error:', error);
            throw InternalServerError('Geocoding service error');
        }
    }

    private formatAddress(address: Partial<IAddress>): string {
        const parts = [
            address.street,
            address.city,
            address.postalCode,
            address.country
        ].filter(Boolean);

        return parts.join(', ');
    }
}
