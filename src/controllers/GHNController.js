import axios from "axios";
import dotenv from 'dotenv'
dotenv.config();
const GHNController = {
    getProvinces: async (req, res) => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': process.env.GHN_API_KEY,
                },
            });
            res.json(response.data.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getDistricts: async (req, res) => {
        const { province_id } = req.params;
        try {
            const response = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                { province_id: Number(province_id) },
                {
                    headers: {
                        'Token': process.env.GHN_API_KEY,
                    },
                }
            );
            res.json(response.data.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getWards: async (req, res) => {
        const { district_id } = req.params;
        try {
            const response = await axios.post(
                'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
                { district_id: Number(district_id) },
                {
                    headers: {
                        'Token': process.env.GHN_API_KEY,
                    },
                }
            );
            res.json(response.data.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    shippingFee: async (req, res) => {
        const { from_district_id, to_district_id, to_ward_code } = req.body;
        try {
            // const serviceResponse = await axios.post(
            //     'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
            //     {
            //         from_district: from_district_id,
            //         to_district: to_district_id,
            //     },
            //     {
            //         headers: {
            //             'Token': process.env.GHN_API_KEY,
            //         },
            //     }
            // );
            // const services = serviceResponse.data.data;
            // if (!services || services.length === 0) {
            //     console.log('Không tìm thấy dịch vụ khả dụng.')
            //     throw new Error('Không tìm thấy dịch vụ khả dụng.');
            // }

            // const service_id = services[0].service_id;
            const district = JSON.parse(to_district_id)
            const feeResponse = await axios.post(

                'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                {
                    service_id: 53320,
                    insurance_value: 0,
                    coupon: null,
                    // from_district_id,
                    to_district_id: district,
                    to_ward_code,
                    weight: 100,
                    height: 50,
                    length: 20,
                    width: 20,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': process.env.GHN_API_KEY,
                        ShopId: 2226625
                    },
                }
            );

            res.send(feeResponse.data);
        } catch (error) {
            console.log(error)
            res.status(500).json('Hiện đơn vị Giao hàng nhanh chỉ giao trong khu vực nội thành Hồ Chí Minh');
        }
    },
}
export default GHNController;