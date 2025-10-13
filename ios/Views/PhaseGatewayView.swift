import SwiftUI

struct PhaseGatewayView: View {
    @State private var selectedPhase: LifePhase? = nil

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .bottom) {
                SkyBackdrop()
                MountainRange()
                    .frame(height: geometry.size.height * 0.45)
                    .offset(y: geometry.size.height * 0.05)
                CloudLayer()
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                    .padding(.top, 24)
                SunView()
                    .frame(width: geometry.size.width * 0.22, height: geometry.size.width * 0.22)
                    .offset(x: geometry.size.width * 0.28, y: -geometry.size.height * 0.2)

                VStack(spacing: 28) {
                    Text("Uteroo Sanctuary")
                        .font(.system(size: 36, weight: .heavy, design: .rounded))
                        .foregroundStyle(.white)
                        .shadow(color: .black.opacity(0.3), radius: 10, y: 4)

                    VStack(spacing: 10) {
                        Text("Choose the path that matches where your body is today.")
                            .font(.system(size: 18, weight: .medium, design: .rounded))
                            .foregroundStyle(.white.opacity(0.92))
                            .multilineTextAlignment(.center)
                        Text("Every door opens to rituals, stories, and gentle quests crafted for that phase.")
                            .font(.system(size: 14, weight: .regular, design: .rounded))
                            .foregroundStyle(.white.opacity(0.86))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                    }

                    PhasePathRow(selectedPhase: $selectedPhase)

                    if let phase = selectedPhase {
                        PhaseSpotlightCard(phase: phase)
                            .transition(.move(edge: .bottom).combined(with: .opacity))
                    }

                    Spacer(minLength: 12)
                }
                .padding(.top, geometry.size.height * 0.12)
                .padding(.bottom, geometry.safeAreaInsets.bottom + 32)
                .padding(.horizontal, 24)
            }
            .ignoresSafeArea()
            .animation(.spring(response: 0.4, dampingFraction: 0.8), value: selectedPhase)
        }
    }
}

// MARK: - Subviews

private struct PhasePathRow: View {
    @Binding var selectedPhase: LifePhase?

    private let columns = [
        GridItem(.flexible(), spacing: 20),
        GridItem(.flexible(), spacing: 20),
        GridItem(.flexible(), spacing: 20)
    ]

    var body: some View {
        LazyVGrid(columns: columns, spacing: 20) {
            ForEach(LifePhase.allCases) { phase in
                PhaseDoorButton(phase: phase, isSelected: selectedPhase == phase)
                    .onTapGesture {
                        selectedPhase = phase
                    }
                    .accessibilityLabel(phase.accessibilityLabel)
            }
        }
        .padding(.horizontal, 8)
    }
}

private struct PhaseDoorButton: View {
    let phase: LifePhase
    let isSelected: Bool

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 28, style: .continuous)
                    .fill(phase.gradient)
                    .overlay(
                        RoundedRectangle(cornerRadius: 28, style: .continuous)
                            .strokeBorder(.white.opacity(0.4), lineWidth: 2)
                    )
                    .shadow(color: phase.shadow.opacity(0.4), radius: 12, y: 8)

                DoorwayShape()
                    .fill(.white.opacity(0.9))
                    .frame(width: 60, height: 100)
                    .offset(y: 12)
                    .overlay(
                        DoorwayShape()
                            .stroke(phase.doorOutline, lineWidth: 3)
                            .offset(y: 12)
                    )
            }
            .frame(height: 180)

            VStack(spacing: 4) {
                Text(phase.title)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                Text(phase.subtitle)
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundStyle(.white.opacity(0.82))
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 32, style: .continuous)
                .fill(Color.white.opacity(isSelected ? 0.28 : 0.12))
                .overlay(
                    RoundedRectangle(cornerRadius: 32, style: .continuous)
                        .stroke(isSelected ? phase.highlight : .white.opacity(0.18), lineWidth: isSelected ? 3 : 1)
                )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 32, style: .continuous)
                .stroke(.white.opacity(0.25), lineWidth: 0.5)
        )
        .contentShape(Rectangle())
    }
}

private struct PhaseSpotlightCard: View {
    let phase: LifePhase

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label {
                Text(phase.spotlightTitle)
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
            } icon: {
                Image(systemName: phase.icon)
                    .font(.system(size: 24, weight: .medium))
            }
            .foregroundStyle(.white)

            Text(phase.description)
                .font(.system(size: 15, weight: .medium, design: .rounded))
                .foregroundStyle(.white.opacity(0.92))
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 16) {
                ForEach(phase.rituals, id: \.self) { ritual in
                    Text(ritual)
                        .font(.system(size: 13, weight: .semibold, design: .rounded))
                        .foregroundStyle(phase.highlight)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(.white.opacity(0.18))
                        .clipShape(Capsule())
                }
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.black.opacity(0.28))
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .stroke(.white.opacity(0.22), lineWidth: 1)
        )
    }
}

// MARK: - Decorative Views

private struct SkyBackdrop: View {
    var body: some View {
        LinearGradient(
            colors: [Color(red: 0.55, green: 0.72, blue: 0.96), Color(red: 0.87, green: 0.92, blue: 0.99)],
            startPoint: .top,
            endPoint: .bottom
        )
        .overlay(
            RadialGradient(
                colors: [Color.white.opacity(0.35), .clear],
                center: .topTrailing,
                startRadius: 60,
                endRadius: 340
            )
        )
        .ignoresSafeArea()
    }
}

private struct SunView: View {
    var body: some View {
        Circle()
            .fill(
                RadialGradient(
                    colors: [Color(red: 1.0, green: 0.93, blue: 0.72), Color(red: 1.0, green: 0.78, blue: 0.45)],
                    center: .center,
                    startRadius: 8,
                    endRadius: 120
                )
            )
            .shadow(color: Color(red: 1.0, green: 0.75, blue: 0.4).opacity(0.4), radius: 20, x: -12, y: 16)
    }
}

private struct CloudLayer: View {
    var body: some View {
        GeometryReader { geo in
            ZStack {
                CloudView(offset: CGSize(width: -geo.size.width * 0.3, height: geo.size.height * 0.1), scale: 1.1)
                CloudView(offset: CGSize(width: geo.size.width * 0.25, height: geo.size.height * 0.0), scale: 0.9)
                CloudView(offset: CGSize(width: geo.size.width * 0.05, height: geo.size.height * 0.18), scale: 1.3)
            }
        }
    }
}

private struct CloudView: View {
    let offset: CGSize
    let scale: CGFloat

    var body: some View {
        ZStack {
            Capsule()
                .fill(Color.white.opacity(0.85))
                .frame(width: 180 * scale, height: 70 * scale)
            Capsule()
                .fill(Color.white.opacity(0.78))
                .frame(width: 150 * scale, height: 65 * scale)
                .offset(x: -50 * scale, y: 12 * scale)
            Capsule()
                .fill(Color.white.opacity(0.75))
                .frame(width: 140 * scale, height: 58 * scale)
                .offset(x: 60 * scale, y: 8 * scale)
        }
        .blur(radius: 0.6 * scale)
        .offset(offset)
    }
}

private struct MountainRange: View {
    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .bottom) {
                MountainShape()
                    .fill(Color(red: 0.44, green: 0.59, blue: 0.72))
                    .frame(width: geo.size.width * 1.4)
                    .offset(x: geo.size.width * 0.15, y: geo.size.height * 0.12)
                    .shadow(color: .black.opacity(0.25), radius: 24, y: 18)

                MountainShape()
                    .fill(Color(red: 0.35, green: 0.52, blue: 0.63))
                    .frame(width: geo.size.width * 1.2)
                    .offset(x: -geo.size.width * 0.05, y: geo.size.height * 0.08)
                    .shadow(color: .black.opacity(0.18), radius: 16, y: 12)

                RollingHillsShape()
                    .fill(LinearGradient(colors: [Color(red: 0.56, green: 0.74, blue: 0.57), Color(red: 0.43, green: 0.63, blue: 0.44)], startPoint: .top, endPoint: .bottom))
                    .frame(height: geo.size.height * 0.55)
                    .overlay(
                        RollingHillsShape()
                            .stroke(Color.white.opacity(0.15), lineWidth: 2)
                    )
            }
        }
    }
}

private struct MountainShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.midX * 0.8, y: rect.maxY * 0.35))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY * 0.15))
        path.addLine(to: CGPoint(x: rect.maxX * 0.9, y: rect.maxY * 0.4))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

private struct RollingHillsShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addCurve(to: CGPoint(x: rect.maxX * 0.4, y: rect.maxY * 0.55), control1: CGPoint(x: rect.maxX * 0.15, y: rect.maxY * 0.7), control2: CGPoint(x: rect.maxX * 0.3, y: rect.maxY * 0.4))
        path.addCurve(to: CGPoint(x: rect.maxX, y: rect.maxY * 0.75), control1: CGPoint(x: rect.maxX * 0.55, y: rect.maxY * 0.7), control2: CGPoint(x: rect.maxX * 0.85, y: rect.maxY * 0.5))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

private struct DoorwayShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let archHeight = rect.height * 0.3
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + archHeight))
        path.addQuadCurve(to: CGPoint(x: rect.maxX, y: rect.minY + archHeight), control: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Supporting Models

enum LifePhase: String, CaseIterable, Identifiable {
    case preMenstrual
    case menstrual
    case postMenstrual

    var id: String { rawValue }

    var title: String {
        switch self {
        case .preMenstrual: return "Pre-menstrual"
        case .menstrual: return "Menstruation"
        case .postMenstrual: return "Post-menstrual"
        }
    }

    var subtitle: String {
        switch self {
        case .preMenstrual: return "Tune into your body’s whispers"
        case .menstrual: return "Slow rituals & deep rest"
        case .postMenstrual: return "Reawaken with gentle energy"
        }
    }

    var spotlightTitle: String {
        switch self {
        case .preMenstrual: return "Nourish the transition"
        case .menstrual: return "Wrap yourself in comfort"
        case .postMenstrual: return "Bloom into the next wave"
        }
    }

    var description: String {
        switch self {
        case .preMenstrual:
            return "Soothe irritability with magnesium-rich snacks, light stretching, and expressive journaling prompts tailored to your emotional tides."
        case .menstrual:
            return "Cozy up with warmth, guided rest meditations, and compassionate reflections that honor your body’s need for slowness."
        case .postMenstrual:
            return "Gently build momentum through creative planning quests, curiosity walks, and playful social micro-missions."
        }
    }

    var rituals: [String] {
        switch self {
        case .preMenstrual: return ["Magnesium cocoa", "Moon stretch", "Feelings journal"]
        case .menstrual: return ["Warm tea altar", "Restorative breath", "Comfort playlist"]
        case .postMenstrual: return ["Sunrise sketch", "Spark walk", "Dream mapping"]
        }
    }

    var icon: String {
        switch self {
        case .preMenstrual: return "moon.haze.fill"
        case .menstrual: return "drop.fill"
        case .postMenstrual: return "sunrise.fill"
        }
    }

    var gradient: LinearGradient {
        switch self {
        case .preMenstrual:
            return LinearGradient(
                colors: [Color(red: 0.64, green: 0.54, blue: 0.91), Color(red: 0.91, green: 0.62, blue: 0.84)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .menstrual:
            return LinearGradient(
                colors: [Color(red: 0.86, green: 0.33, blue: 0.46), Color(red: 0.98, green: 0.52, blue: 0.56)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .postMenstrual:
            return LinearGradient(
                colors: [Color(red: 0.37, green: 0.71, blue: 0.68), Color(red: 0.45, green: 0.86, blue: 0.78)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }

    var highlight: Color {
        switch self {
        case .preMenstrual: return Color(red: 0.93, green: 0.79, blue: 0.97)
        case .menstrual: return Color(red: 1.0, green: 0.78, blue: 0.78)
        case .postMenstrual: return Color(red: 0.76, green: 0.94, blue: 0.88)
        }
    }

    var shadow: Color {
        switch self {
        case .preMenstrual: return Color(red: 0.46, green: 0.36, blue: 0.72)
        case .menstrual: return Color(red: 0.66, green: 0.21, blue: 0.3)
        case .postMenstrual: return Color(red: 0.23, green: 0.58, blue: 0.51)
        }
    }

    var doorOutline: Color {
        switch self {
        case .preMenstrual: return Color(red: 0.62, green: 0.47, blue: 0.83)
        case .menstrual: return Color(red: 0.73, green: 0.22, blue: 0.32)
        case .postMenstrual: return Color(red: 0.27, green: 0.63, blue: 0.56)
        }
    }

    var accessibilityLabel: String {
        switch self {
        case .preMenstrual:
            return "Pre-menstrual gateway. Tap to explore soothing rituals before your bleed begins."
        case .menstrual:
            return "Menstrual sanctuary door. Tap to enter comforting rest activities for your bleed."
        case .postMenstrual:
            return "Post-menstrual path. Tap to discover energizing practices after your period."
        }
    }
}

#if DEBUG
struct PhaseGatewayView_Previews: PreviewProvider {
    static var previews: some View {
        PhaseGatewayView()
            .previewDevice("iPhone 14 Pro")
    }
}
#endif
