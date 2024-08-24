import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { prismaClient } from "..";

export const createCuti = async (req: Request, res: Response) => {
    const { nomorInduk, tanggalCuti, lamaCuti, keterangan } = req.body;
    const prisma = new PrismaClient();
    try {
        const karyawan = await prisma.karyawan.findUnique({
            where: { nomorInduk },
        });

        if (!karyawan) {
            return res.status(404).json({ error: "Nomor Induk does not exist in Karyawan table" });
        }
        const cuti = await prisma.cuti.create({
            data: {
                nomorInduk,
                tanggalCuti: new Date(tanggalCuti),
                lamaCuti,
                keterangan,
            },
        });
        res.json(cuti);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateCuti = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { tanggalCuti, lamaCuti, keterangan } = req.body;
    const prisma = new PrismaClient();

    try {
        const existingCuti = await prisma.cuti.findUnique({
            where: { id: Number(id) },
        });

        if (!existingCuti) {
            return res.status(404).json({ error: "Cuti entry not found" });
        }
        const updatedCuti = await prisma.cuti.update({
            where: { id: Number(id) },
            data: {
                tanggalCuti: tanggalCuti ? new Date(tanggalCuti) : existingCuti.tanggalCuti,
                lamaCuti: lamaCuti !== undefined ? lamaCuti : existingCuti.lamaCuti,
                keterangan: keterangan !== undefined ? keterangan : existingCuti.keterangan,
            },
        });

        res.json(updatedCuti);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteCuti = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const prisma = new PrismaClient();

    try {
        const existingCuti = await prisma.cuti.findUnique({
            where: { id: Number(id) },
        });

        if (!existingCuti) {
            return res.status(404).json({ error: "Cuti entry not found" });
        }
        await prisma.cuti.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Cuti entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    } 
};

export const getAllCuti = async (req: Request, res: Response) => {
    const { sortBy, orderBy } = req.query; // Read the sortBy and orderBy query parameters

    let sortField: 'tanggalCuti' | undefined;
    let sortDirection: 'asc' | 'desc' = 'asc'; 

    if (sortBy === 'tanggalCuti') {
        sortField = sortBy as 'tanggalCuti';
    }

    if (orderBy === 'desc') {
        sortDirection = 'desc';
    }

    try {
        const cuti = await prismaClient.cuti.findMany({
            orderBy: sortField ? { [sortField]: sortDirection } : undefined, 
        });

        res.json(cuti);
    } catch (error) {
        console.error('Error fetching Cuti:', error);
        res.status(500).json({ error: "Internal server error" });
    } 
}