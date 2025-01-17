/****** Object:  Table [dbo].[BeneficiosCorporativos]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BeneficiosCorporativos](
	[Id_Beneficios_Corp] [int] NOT NULL,
	[Beneficios_Corporativos] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VistaBeneficiosCorporativos]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VistaBeneficiosCorporativos] AS
SELECT Id_Beneficios_Corp, Beneficios_Corporativos
FROM BeneficiosCorporativos;
GO
/****** Object:  Table [dbo].[Calendario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Calendario](
	[evento] [varchar](100) NULL,
	[fecha] [date] NOT NULL,
	[NombreEvento] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[NombreEvento] ASC,
	[fecha] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VistaCalendario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[VistaCalendario] AS
SELECT NombreEvento, fecha
FROM Calendario;
GO
/****** Object:  Table [dbo].[Jugador]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Jugador](
	[ID_Jugador] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NULL,
	[IdUsuario] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Jugador] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Progreso]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Progreso](
	[ID_Progreso] [int] IDENTITY(1,1) NOT NULL,
	[Num_escenas] [int] NULL,
	[Duracion_Total_escenas] [time](7) NULL,
	[ID_Jugador] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_Progreso] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VistaProgresoJugadores]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[VistaProgresoJugadores] AS
SELECT J.nombre, P.Num_escenas, P.Duracion_Total_escenas
FROM Jugador J
JOIN Progreso P ON J.ID_Jugador = P.ID_Jugador;
GO
/****** Object:  Table [dbo].[ContraseñaUsuario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ContraseñaUsuario](
	[Id_Usuario] [int] NULL,
	[Crear_Contraseña] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[Id] [int] NOT NULL,
	[Employee_Group] [nvarchar](50) NULL,
	[Birth_date] [date] NULL,
 CONSTRAINT [PK_Usuarios] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VistaUsuariosContraseña]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[VistaUsuariosContraseña] AS
SELECT U.Id, U.Employee_Group, C.Crear_Contraseña
FROM Usuario U
LEFT JOIN ContraseñaUsuario C ON U.Id = C.Id_Usuario;
GO
/****** Object:  Table [dbo].[Videojuego]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Videojuego](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [varchar](100) NULL,
	[descripcion] [varchar](255) NULL,
	[progreso] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VistaVideojuegos]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[VistaVideojuegos] AS
SELECT V.titulo, V.descripcion, P.Num_escenas
FROM Videojuego V
LEFT JOIN Progreso P ON V.progreso = P.ID_Progreso;
GO
/****** Object:  Table [dbo].[Beneficios]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Beneficios](
	[Beneficio_nom] [nvarchar](100) NOT NULL,
	[Descripcion] [nvarchar](500) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BeneficiosIncentivos]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BeneficiosIncentivos](
	[Id_Incentivos] [int] NOT NULL,
	[Beneficios_Incentivos] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BeneficiosMedicina]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BeneficiosMedicina](
	[Id_BeneficioMedic] [int] NOT NULL,
	[Beneficio_Medic] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CerrarSesion]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CerrarSesion](
	[FechaDeSalida] [datetime] NOT NULL,
	[IdDeSalida] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Comprobacion]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comprobacion](
	[FechaDeAcceso] [date] NOT NULL,
	[IdDeAcceso] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[FechaDeAcceso] ASC,
	[IdDeAcceso] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Contacto]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Contacto](
	[nombreEmisor] [varchar](100) NOT NULL,
	[IdContacto] [varchar](50) NOT NULL,
	[AreaTrabajo] [varchar](100) NULL,
	[Mensaje] [varchar](255) NULL,
	[FechaContacto] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Escena]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Escena](
	[ID_escena] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_Escena] [varchar](100) NULL,
	[Duracion_Escena] [time](7) NULL,
	[ID_Progreso] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID_escena] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Login]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Login](
	[IdLogin] [varchar](50) NOT NULL,
	[FechaInicio] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoginAdministracion]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoginAdministracion](
	[IdAdministracionLogin] [int] NOT NULL,
	[FechaInicioAdministracion] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TipoCompensacion]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TipoCompensacion](
	[Nombre_Compensacion] [varchar](100) NOT NULL,
	[Descripcion_tipo] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Nombre_Compensacion] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UsuarioAdministrador]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsuarioAdministrador](
	[Id_Administracion] [int] NULL,
	[Contraseña] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Escena]  WITH CHECK ADD FOREIGN KEY([ID_Progreso])
REFERENCES [dbo].[Progreso] ([ID_Progreso])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Jugador]  WITH CHECK ADD FOREIGN KEY([IdUsuario])
REFERENCES [dbo].[Usuario] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Progreso]  WITH CHECK ADD FOREIGN KEY([ID_Jugador])
REFERENCES [dbo].[Jugador] ([ID_Jugador])
ON DELETE CASCADE
GO
/****** Object:  StoredProcedure [dbo].[ActualizarProgreso]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[ActualizarProgreso]
@ID_Jugador INT,
@Num_escenas INT,
@Duracion_Total TIME
AS
BEGIN
   UPDATE Progreso
   SET Num_escenas = @Num_escenas, Duracion_Total_escenas = @Duracion_Total
   WHERE ID_Jugador = @ID_Jugador;
END;
GO
/****** Object:  StoredProcedure [dbo].[ConsultarBeneficiosMedicina]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[ConsultarBeneficiosMedicina]
AS
BEGIN
   SELECT * FROM BeneficiosMedicina;
END;
GO
/****** Object:  StoredProcedure [dbo].[EliminarUsuario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[EliminarUsuario]
@Id INT
AS
BEGIN
   DELETE FROM Usuario WHERE Id = @Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[InsertarBeneficioCorporativo]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[InsertarBeneficioCorporativo]
@Beneficio_Corporativo VARCHAR(100)
AS
BEGIN
   INSERT INTO BeneficiosCorporativos (Beneficios_Corporativos)
   VALUES (@Beneficio_Corporativo);
END;
GO
/****** Object:  StoredProcedure [dbo].[ObtenerContraseñaUsuario]    Script Date: 10/18/2024 11:59:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ObtenerContraseñaUsuario]
@Id_Usuario INT
AS
BEGIN
   SELECT Crear_Contraseña FROM ContraseñaUsuario WHERE Id_Usuario = @Id_Usuario;
END;
GO
