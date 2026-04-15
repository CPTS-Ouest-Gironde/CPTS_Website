import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDashboardPharmacyHref, type DashboardFilters } from "@/lib/pso/dashboard-filters"
import type { DashboardPharmacyDetail } from "@/lib/pso/dashboard-stats"

type DashboardPharmacyDetailTableProps = {
  details: DashboardPharmacyDetail[]
  filters: DashboardFilters
}

function getDisplayValue(value: string | null) {
  return value ?? "Non renseigné"
}

export function DashboardPharmacyDetailTable({ details, filters }: DashboardPharmacyDetailTableProps) {
  return (
    <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base">Détail par pharmacie</CardTitle>
        <p className="text-sm text-muted-foreground">
          Identifiant des pharmacies actives sur la période et accès aux saisies pour audit.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pharmacie</TableHead>
              <TableHead>FINESS</TableHead>
              <TableHead>Pharmacien titulaire</TableHead>
              <TableHead>RPPS</TableHead>
              <TableHead>Saisies</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.pharmacieId}>
                <TableCell className="font-medium text-foreground">{detail.pharmacieNom}</TableCell>
                <TableCell>{detail.pharmacieFiness}</TableCell>
                <TableCell>{getDisplayValue(detail.pharmacienTitulaire)}</TableCell>
                <TableCell>{getDisplayValue(detail.pharmacienRpps)}</TableCell>
                <TableCell>{detail.totalPatients}</TableCell>
                <TableCell className="text-right">
                  <Button asChild className="rounded-full px-4" variant="outline">
                    <Link href={getDashboardPharmacyHref(filters, detail.pharmacieId)}>
                      Voir les saisies
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
