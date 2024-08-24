import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { prismaClient } from ".."

export const createKaryawan = async (req:Request, res:Response) => {
    const { nomorInduk, nama, alamat, tanggalLahir, tanggalBergabung } = req.body;
    const prisma = new PrismaClient();

    // Check if all required fields are present
    if (!nomorInduk || !nama || !alamat || !tanggalLahir || !tanggalBergabung) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingKaryawan = await prisma.karyawan.findUnique({
            where: { nomorInduk },
        });

        if (existingKaryawan) {
            return res.status(400).json({ error: 'Karyawan with this Nomor Induk already exists' });
        }
        const karyawan = await prisma.karyawan.create({
            data: {
                nomorInduk,
                nama,
                alamat,
                tanggalLahir: new Date(tanggalLahir),
                tanggalBergabung: new Date(tanggalBergabung),
            },
        });

        res.json(karyawan);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateKaryawan = async (req:Request, res:Response) => {
    const { nomorInduk } = req.params;
    const { nama, alamat, tanggalLahir, tanggalBergabung } = req.body;
    const prisma = new PrismaClient();

    try {
        const existingKaryawan = await prisma.karyawan.findUnique({
            where: { nomorInduk },
        });

        if (!existingKaryawan) {
            return res.status(404).json({ error: 'Karyawan not found' });
        }

        const updatedKaryawan = await prisma.karyawan.update({
            where: { nomorInduk },
            data: {
                nama: nama || existingKaryawan.nama,
                alamat: alamat || existingKaryawan.alamat,
                tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : existingKaryawan.tanggalLahir,
                tanggalBergabung: tanggalBergabung ? new Date(tanggalBergabung) : existingKaryawan.tanggalBergabung,
            },
        });

        res.json(updatedKaryawan);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteKaryawan = async (req:Request, res:Response) => {
    const { nomorInduk } = req.params;
    const prisma = new PrismaClient();

    try {
        const existingKaryawan = await prisma.karyawan.findUnique({
            where: { nomorInduk },
        });

        if (!existingKaryawan) {
            return res.status(404).json({ error: "Karyawan not found" });
        }

        await prisma.karyawan.delete({
            where: { nomorInduk },
        });

        res.json({ message: "Karyawan deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllKaryawan = async (req: Request, res: Response) => {
    const { sortBy, orderBy } = req.query; 

    let sortField: 'tanggalLahir' | 'nama' | undefined;
    let sortDirection: 'asc' | 'desc' = 'asc'; 

    if (sortBy === 'tanggalLahir' || sortBy === 'nama') {
        sortField = sortBy as 'tanggalLahir' | 'nama';
    }

    if (orderBy === 'desc') {
        sortDirection = 'desc';
    }

    try {
        const karyawan = await prismaClient.karyawan.findMany({
            orderBy: sortField ? { [sortField]: sortDirection } : undefined,
        });

        res.json(karyawan);
    } catch (error) {
        console.error('Error fetching Karyawan:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getKaryawanWithCuti = async (req: Request, res: Response) => {
    const { nomorInduk } = req.params;

    try {
        const karyawan = await prismaClient.karyawan.findUnique({
            where: { nomorInduk },
            include: { cutis: true },
        });

        if (!karyawan) {
            return res.status(404).json({ error: "Karyawan not found" });
        }

        res.json(karyawan);
    } catch (error) {
        console.error('Error fetching Karyawan with Cuti:', error);
        res.status(500).json({ error: "Internal server error" });
    } 
};