import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { RequestWithUser } from "../auth/types/request-with-user";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PROFESSIONAL)
@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: RequestWithUser) {
    console.log("💡 ID del usuario autenticado:", req.user);
    const userId = (req.user as any).userId;
    return this.reportService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get("exists")
  existsByAppointmentIds(
    @Query("appointmentIds") appointmentIdsParam?: string
  ) {
    if (!appointmentIdsParam) {
      throw new BadRequestException(
        "appointmentIds es requerido. Ej: ?appointmentIds=1,2,3"
      );
    }
    const ids = appointmentIdsParam
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);

    if (ids.length === 0) {
      throw new BadRequestException("appointmentIds inválidos");
    }

    return this.reportService.existsByAppointmentIds(ids);
  }

  @Get("by-appointment/:appointmentId/latest")
  findLatestByAppointment(
    @Param("appointmentId", ParseIntPipe) appointmentId: number
  ) {
    return this.reportService.findLatestByAppointment(appointmentId);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.reportService.findOne(id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateReportDto) {
    return this.reportService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.reportService.remove(id);
  }
}
