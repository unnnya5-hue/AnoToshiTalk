import SwiftUI

struct EraSetupView: View {
    @Environment(AppModel.self) private var model
    @State private var mode: InputMode
    @State private var gender: GenderChoice = .unspecified
    @State private var age = 35
    @State private var year = 2000
    @State private var decade = 1990
    @State private var stages = Set(LifeStage.allCases)
    @State private var showAdGate = false

    init(initialMode: InputMode) { _mode = State(initialValue: initialMode) }

    var condition: SearchCondition {
        let input: EraInput = switch mode {
        case .age: .age(age, referenceYear: Calendar(identifier: .gregorian).component(.year, from: .now))
        case .year: .year(year)
        case .decade: .decade(decade)
        }
        return .init(input: input, gender: gender, selectedCategories: Set(TopicCategory.allCases), lifeStages: stages)
    }

    var body: some View {
        NavigationStack {
            Form {
                Picker("入力方法", selection: $mode) { ForEach(InputMode.allCases) { Text($0.title).tag($0) } }.pickerStyle(.segmented)
                Section("性別") { Picker("性別", selection: $gender) { ForEach(GenderChoice.allCases) { Text($0.title).tag($0) } }.pickerStyle(.segmented) }
                Section(mode.title) {
                    if mode == .age { Picker("年齢", selection: $age) { ForEach(13...100, id: \.self) { Text("\($0)歳").tag($0) } } }
                    else if mode == .year { Picker("年", selection: $year) { ForEach(model.availableYears.reversed(), id: \.self) { Text("\($0)年").tag($0) } } }
                    else { Picker("年代", selection: $decade) { ForEach(decades.reversed(), id: \.self) { Text("\($0)年代").tag($0) } } }
                }
                if mode == .age {
                    Section("時期の目安（複数選択）") {
                        ForEach(LifeStage.allCases) { stage in
                            Toggle(stage.title, isOn: Binding(
                                get: { stages.contains(stage) },
                                set: { enabled in
                                    if enabled { stages.insert(stage) } else { stages.remove(stage) }
                                }
                            ))
                        }
                        Text("進学・就職歴ではなく、年齢帯の目安です。生年・当時年齢は約1年ずれる場合があります。").font(.footnote).foregroundStyle(.secondary)
                    }
                }
                Section {
                    let count = model.candidateCount(for: condition)
                    if count == 0 { Text("この条件で表示できる話題がありません。条件を変更してください。 ").foregroundStyle(.red) }
                    Button("あの頃を見てみる") { showAdGate = true }.primaryButton().disabled(count == 0 || stages.isEmpty)
                    Text("候補 \(count)件").frame(maxWidth: .infinity).font(.footnote).foregroundStyle(.secondary)
                }
            }
            .navigationTitle("あなたの青春")
            .toolbar { ToolbarItem(placement: .topBarLeading) { Button("戻る") { model.goHome() } } }
            .sheet(isPresented: $showAdGate) {
                VStack(spacing: 20) {
                    Text("セットを始める").font(.title2.bold())
                    Text("広告を最後まで見ると、1セット（\(mode == .year ? 7 : 15)件）遊べます。").multilineTextAlignment(.center)
                    Button("広告を見て始める") {
                        Task {
                            await model.authorizeAndStart(condition: condition)
                            if model.screen == .session { showAdGate = false }
                        }
                    }.primaryButton()
                    Button("キャンセル", role: .cancel) { showAdGate = false }
                    Text("Debug版ではGoogle公式のテスト広告が表示されます。 ").font(.caption).foregroundStyle(.secondary)
                }.padding(24).presentationDetents([.medium])
            }
            .onAppear {
                if !model.availableYears.contains(year) { year = model.availableYears.upperBound }
                decade = (model.availableYears.upperBound / 10) * 10
            }
        }
    }

    private var decades: [Int] {
        let lower = (model.availableYears.lowerBound / 10) * 10, upper = (model.availableYears.upperBound / 10) * 10
        return Array(stride(from: lower, through: upper, by: 10))
    }
}

