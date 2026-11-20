**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «إنشاء حصة مستقبلية بالمدرب والحصان والموقع المعتمد»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Scheduling workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified scheduling record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 14, 15, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-05, DEC-06, DEC-07, DEC-12 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SCH-002 — Publish recurring/multi-instructor schedules and verify all saved openings

**العنوان العربي:** نشر الجداول المتكررة ومتعددة المدربين والتحقق من جميع الحصص

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SCH-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Scheduling | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SCH-001, SCH-003, SCH-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: publish recurring/multi-instructor schedules and verify all saved openings, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «نشر الجداول المتكررة ومتعددة المدربين والتحقق من جميع الحصص» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Scheduling workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «نشر الجداول المتكررة ومتعددة المدربين والتحقق من جميع الحصص» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «نشر الجداول المتكررة ومتعددة المدربين والتحقق من جميع الحصص»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Scheduling; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Classes/Bookings Add or Edit; relevant resource reads.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Set recurrence dates weekdays and instructors from approved timetable. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من المدرب والتاريخ ضمن إجراء «نشر الجداول المتكررة ومتعددة المدربين ومراجعة جميع الحصص»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Preview actual occurrence dates and resource assignments. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الموارد المتاحة والمصدر والتاريخ ضمن إجراء «نشر الجداول المتكررة ومتعددة المدربين ومراجعة جميع الحصص»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Save multi-instructor expansions and inspect each distinct opening. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع المدرب ضمن إجراء «نشر الجداول المتكررة ومتعددة المدربين ومراجعة جميع الحصص»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Investigate rejected conflicts without overbooking or duplicating original class. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحصة والحجز ضمن إجراء «نشر الجداول المتكررة ومتعددة المدربين ومراجعة جميع الحصص»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Scheduling workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified scheduling record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 14, 15, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-05, DEC-06, DEC-07, DEC-12 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### SCH-003 — Amend booked sessions safely and notify affected customers

**العنوان العربي:** تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: SCH-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Scheduling/operations | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: SCH-001, SCH-002, SCH-004.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: amend booked sessions safely and notify affected customers, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Scheduling workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Scheduling/operations; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Classes/Bookings Add or Edit; relevant resource reads.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Identify booked future class and affected customers. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحصة ضمن إجراء «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Obtain authorised new time resources and communication decision. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الموارد المتاحة والمصدر ضمن إجراء «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Edit through scheduling workflow subject to booked capacity and snapshot locks. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث البيانات ذات الصلة ضمن إجراء «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify resulting bookings and customer notices without promising automatic alternatives. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز ضمن إجراء «تعديل الحصص المحجوزة بأمان وإبلاغ الأعضاء المتأثرين»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Scheduling workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified scheduling record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Server rechecks horse/resources/capacity and feeding windows; do not force conflicts. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 14, 15, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-05, DEC-06, DEC-07, DEC-12 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### BKG-001 — Member self-booking with a fresh quote

**العنوان العربي:** حجز العضو للحصة بعد الحصول على عرض سعر حديث

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: BKG-001 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Member/member services | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: BKG-002, BKG-003, BKG-004, BKG-005, BKG-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: member self-booking with a fresh quote, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «حجز العضو للحصة بعد الحصول على عرض سعر حديث» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Bookings workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «حجز العضو للحصة بعد الحصول على عرض سعر حديث» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «حجز العضو للحصة بعد الحصول على عرض سعر حديث»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Member/member services; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Bookings Add/Edit/Delete according to action; member self-service limited to own eligible records.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Member verifies own academy and chooses available future session. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من الحصة ضمن إجراء «حجز العضو للحصة بعد الحصول على عرض سعر حديث»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Select monetary or sufficient credit route and request fresh quote. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** اختر البيانات ذات الصلة ضمن إجراء «حجز العضو للحصة بعد الحصول على عرض سعر حديث»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Review instructor horse price and hold status before confirmation. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصان والمدرب ضمن إجراء «حجز العضو للحصة بعد الحصول على عرض سعر حديث»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify booking member visibility pro forma and credit effects. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز وطلب الدفع ضمن إجراء «حجز العضو للحصة بعد الحصول على عرض سعر حديث»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Bookings workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified bookings record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 11, 12, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-04, DEC-05, DEC-12, DEC-14 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### BKG-002 — Staff booking for an explicitly selected member

**العنوان العربي:** إنشاء حجز للعضو من قِبل موظف مخوّل

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: BKG-002 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Member services | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: BKG-001, BKG-003, BKG-004, BKG-005, BKG-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: staff booking for an explicitly selected member, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إنشاء حجز للعضو من قِبل موظف مخوّل» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Bookings workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إنشاء حجز للعضو من قِبل موظف مخوّل» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إنشاء حجز للعضو من قِبل موظف مخوّل»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Member services; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Bookings Add/Edit/Delete according to action; member self-service limited to own eligible records.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Staff verifies own academy and selects Book for member explicitly. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** تحقق من البيانات ذات الصلة ضمن إجراء «إنشاء حجز للعضو من قِبل موظف مخوّل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. ميّز بين الموظف المنفذ والعضو المستفيد. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Confirm customer ID and future class before fresh quote. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصة ضمن إجراء «إنشاء حجز للعضو من قِبل موظف مخوّل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Choose eligible money or credit route and confirm server validation. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إنشاء حجز للعضو من قِبل موظف مخوّل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Verify selected member owns booking/pro forma not staff operator. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز وطلب الدفع ضمن إجراء «إنشاء حجز للعضو من قِبل موظف مخوّل»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. ميّز بين الموظف المنفذ والعضو المستفيد. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Bookings workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified bookings record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 11, 12, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-04, DEC-05, DEC-12, DEC-14 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### BKG-003 — Monitor holds, deadlines, partial payments and expiry

**العنوان العربي:** متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: BKG-003 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Member services/finance | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: BKG-001, BKG-002, BKG-004, BKG-005, BKG-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: monitor holds, deadlines, partial payments and expiry, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Bookings workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Member services/finance; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Bookings Add/Edit/Delete according to action; member self-service limited to own eligible records.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Review pending_payment holds and deadline earlier of configured duration or class start. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصة ومهلة الحجز المعلّق والسداد ضمن إجراء «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Identify partial receipts and confirm they do not extend hold. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. On expiry verify seat release and request reconciliation status. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Escalate late receipts without forcing an expired booking. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد الحجز ضمن إجراء «متابعة الحجوزات المعلقة ومواعيد السداد والدفعات الجزئية وانتهاء المهلة»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Bookings workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Configured hold default is 72 hours (allowed range 1–720), capped at class start; prior deadlines do not retroactively change. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified bookings record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 11, 12, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-04, DEC-05, DEC-12, DEC-14 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### BKG-005 — Cancel an eligible session and verify credit/voucher restoration

**العنوان العربي:** إلغاء حجز مستوفٍ للشروط والتحقق من إعادة رصيد الحصص أو القسائم

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: BKG-005 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Member services/finance | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: BKG-001, BKG-002, BKG-003, BKG-004, BKG-006.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: cancel an eligible session and verify credit/voucher restoration, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إلغاء حجز مستوفٍ للشروط والتحقق من إعادة رصيد الحصص أو القسائم» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Bookings workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إلغاء حجز مستوفٍ للشروط والتحقق من إعادة رصيد الحصص أو القسائم» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إلغاء حجز مستوفٍ للشروط والتحقق من إعادة رصيد الحصص أو القسائم»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Member services/finance; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Bookings Add/Edit/Delete according to action; member self-service limited to own eligible records.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Check future booking status credit route and recorded money. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والسجل ضمن إجراء «إلغاء حجز مستوفٍ للشروط ومراجعة إعادة رصيد الحصص أو القسائم»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. For eligible credit-only cancellation use authorised cancel and verify exact credit restoration once. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع البيانات ذات الصلة ضمن إجراء «إلغاء حجز مستوفٍ للشروط ومراجعة إعادة رصيد الحصص أو القسائم»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. For monetary booking verify voucher/discount restoration or finance refund prerequisite. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحجز والاسترداد المالي ضمن إجراء «إلغاء حجز مستوفٍ للشروط ومراجعة إعادة رصيد الحصص أو القسائم»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Never cancel started/past bookings or issue duplicate credits. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** أنشئ الحجز ورصيد الحصص ضمن إجراء «إلغاء حجز مستوفٍ للشروط ومراجعة إعادة رصيد الحصص أو القسائم»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تأكد من عدم تكرار القيد أو الحركة. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Bookings workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Credit-only eligible future cancellation restores consumed credits; paid booking cancellation is blocked until reconciliation. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified bookings record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ

**EN:** [Verify source]

**AR:** السجلات والخصوصية والاحتفاظ: احتفظ بالمراجع والأدلة في الموقع المعتمد، وحدد صلاحية الاطلاع حسب العضو والأكاديمية. مدد الحفظ والإتلاف وموقع الأرشيف تحتاج موافقة الإدارة.


#### 13. Monitoring and sign-off / المتابعة والتوقيع

**EN:** Proposed verifier checks identity/academy, source evidence, server result, linked balance/stock/capacity effects, exception closure and communication. Track unresolved cases and duplicates; metric denominator, frequency, target and reviewer: TBC.

**AR:** المتابعة والتوقيع: يراجع المخول الهوية والأدلة والنتيجة والتأثيرات المرتبطة وسلامة التصحيح وتسوية الاستثناءات. المؤشرات والأهداف ودورية المتابعة تحتاج إلى موافقة الإدارة.


#### 14. Safety, legal and professional boundaries / حدود السلامة والقانون والمهنة

**EN:** Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Application permission is not clinical, safety, financial or legal authority. Any operational policy not evidenced in the KB requires human approval; do not infer thresholds, tax compliance, prescriptions, tariffs, contractual rights or physical readiness.

**AR:** حدود السلامة والقانون والمهنة: صلاحية استخدام النظام ليست اعتماداً طبياً أو بيطرياً أو مالياً أو قانونياً. لا تُستنتج حدود السلامة أو الجرعات أو الأسعار أو المتطلبات التنظيمية من بيانات تجريبية أو من واجهات النظام.


#### 15. Training and competence / التدريب والكفاءة

**EN:** Authorised operator must demonstrate correct academy and record selection, appropriate screen/action permission, execution of the four steps, stop conditions, evidence capture and escalation. Trainer, assessment, refresher schedule and sign-off: TBC.

**AR:** التدريب والكفاءة: يجب أن يثبت المنفذ قدرته على التحقق من السجل والصلاحيات واتباع خطوات الإجراء واكتشاف حالات التوقف وتوثيق الاستثناءات والتسليم. معايير التقييم واعتماد الكفاءة غير محددة.


#### 16. Source trace and change log / المصادر وسجل التغيير

**EN:** RPH-CMS-KB-001 rev 1.0 §§9, 10, 11, 12, 21, 25, 26; catalogue §25; decision register §26; evidence §28; SOP template §29. Linked decisions: DEC-04, DEC-05, DEC-12, DEC-14 (applicability and policy values to be confirmed). Revision 0.1 dated 20 Nov 2026, AI-assisted initial draft, no human approval.

**AR:** المصدر والإصدار: راجع الأقسام المشار إليها في قاعدة المعرفة RPH-CMS-KB-001 وسجل القرارات غير المحسومة وسجل التعديلات. لا يصبح الإجراء نافذاً قبل استكمال مراجعة أصحاب الصلاحية واعتماده.

**Revision:** 1.0.2 — Arabic language and bilingual layout improvements; human approval pending.


### BKG-006 — Record/correct attendance and escalate no-shows

**العنوان العربي:** إثبات الحضور وتصحيحه والتعامل مع حالات الغياب

**v1.0.2 | DRAFT — NOT APPROVED FOR OPERATIONAL USE**


#### 1. Control header / بيانات ضبط الإجراء

**EN:** ID: BKG-006 | Version: 1.0.2 | Status: DRAFT — NOT APPROVED FOR OPERATIONAL USE | Priority: P1 | Proposed owner: Instructor/scheduling | Proposed approver: designated accountable manager/specialist (TBC) | Effective/review dates: TBC | Related SOPs: BKG-001, BKG-002, BKG-003, BKG-004, BKG-005.

**AR:** البيانات الأساسية: رقم الإجراء وإصداره وحالته ومسؤوليته وأولوية تنفيذه والموافقات المطلوبة وتاريخ النفاذ والمراجعة. جميع المسؤوليات المقترحة تحتاج اعتماد الإدارة، ولا يوجد اعتماد تشغيلي لهذه النسخة.


#### 2. Purpose / الغرض

**EN:** Ensure controlled, traceable execution of: record/correct attendance and escalate no-shows, with correct academy/customer/horse references, documented exceptions and authorised follow-up.

**AR:** الغرض من هذا الإجراء هو «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب» على نحوٍ موثق وقابل للمراجعة، مع التصعيد عند وجود استثناء.


#### 3. Scope and exclusions / النطاق والاستثناءات

**EN:** Bookings workflow in the authenticated management web portal and, only where implemented, member web/native iOS. Authoring and privileged configuration are web/restricted-operator tasks unless explicitly supported in the app. No public marketing website, unapproved physical service, clinical prescription, legal decision, bank transaction or software change is authorised by this draft.

**AR:** ينطبق على العملية «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب» ضمن صلاحيات النظام المعتمدة، ولا يشمل تنفيذ أعمال خارج نطاق التفويض.


#### 4. Trigger and frequency / متى يبدأ وتكراره

**EN:** Start when the described operation is requested, a relevant record changes or an exception is discovered. Routine review frequency and response targets: TBC — MANAGEMENT APPROVAL REQUIRED.

**AR:** يُنفذ عند الحاجة إلى «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب»، أما التكرار ومواعيد المتابعة فتحتاج إلى اعتماد إدارة النادي.


#### 5. Responsible roles / الأدوار والمسؤوليات

**EN:** Proposed operator: Instructor/scheduling; verifier: relevant supervisor or independent reviewer; approver: designated management/finance/veterinary/technical authority as applicable; escalation deputy: TBC. These are proposed functions, not confirmed appointments. Separate business approval from software grants.

**AR:** الأدوار: المنفذ هو المسؤول المقترح في فهرس الإجراءات؛ ويقوم المشرف أو المراجع المستقل بالتحقق، وتعتمد الجهة المختصة القرار عند الحاجة. يُفصل بين صلاحية النظام والموافقة الإدارية أو المهنية.


#### 6. Prerequisites / المتطلبات المسبقة

**EN:** Verify personal sign-in, selected academy, correct source record and ID, permitted action, up-to-date application state, and any approved policy, evidence, physical resource or external receipt required. Applicable access: Bookings Add/Edit/Delete according to action; member self-service limited to own eligible records.

**AR:** المتطلبات المسبقة: تحقق من الحساب الشخصي والأكاديمية المختارة ومعرف السجل والصلاحية وصحة البيانات الحالية. لا تُنفذ العملية دون مستند أو موافقة أو مورد أو إثبات مالي خارجي عندما يكون مطلوباً.


#### 7. Inputs and evidence / المدخلات والأدلة

**EN:** Retain relevant user/horse/class/booking/plan/inventory/stay IDs, Riyadh-local date and original timestamp, source approval, supporting documents, before/after values and reference numbers. Do not record passwords, SMTP secrets or full card data.

**AR:** المدخلات والأدلة: سجل المعرفات المرجعية والتاريخ والتوقيت المحلي للرياض والمرجع الأصلي والموافقة والمرفقات والقيم قبل التعديل وبعده. لا تُدوّن كلمات المرور أو مفاتيح الخدمات أو بيانات البطاقات الحساسة.


#### 8. Procedure / خطوات التنفيذ

**EN:** Numbered operational steps; use exact currently deployed screen labels where they differ from the working terms below.

**AR:** خطوات التنفيذ: اتبع الخطوات الإنجليزية المرقمة الموازية بالترتيب، وتحقق بعد كل خطوة من النتيجة في السجل الأساسي. إذا لم تتطابق النتيجة، أوقف التكرار غير المدروس وارفع الاستثناء.

**EN:** 8.1. Verify class reservation member and actual attendance evidence. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** راجع الحصة ضمن إجراء «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.2. Record attended or absent with Booking Edit authority. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** دوّن الحجز والسجل ضمن إجراء «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.3. Correct inaccurate entry through authorised audit-preserving process. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** حدّث البيانات ذات الصلة ضمن إجراء «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**EN:** 8.4. Escalate no-show/makeup policy without inventing credit or refund entitlement. Expected result: the specified change or verification is visible in the authorised source record; if not, stop and investigate before repeating.

**AR:** صعّد الاسترداد المالي ضمن إجراء «إثبات الحضور وتصحيحه والتعامل مع حالات الغياب»، مع مراعاة صلاحيات المستخدم والسجل الصحيح. تحقق من النتيجة المحفوظة قبل الانتقال إلى الخطوة التالية، ووثّق أي استثناء.

**Platform differences:** Staff web: use the relevant Bookings workspace and confirm independent page/action grants. Native iOS: use the corresponding daily-use screen only where implemented (KB §21); web-only configuration, role grants and advanced authoring must not be attempted in the app. Member web/iOS: only own bookings, account, credits, notifications and linked horses where applicable; never academy-wide staff administration. Restricted IT procedures have no member or routine iOS variant.


#### 9. Validation and stop conditions / التحقق وشروط التوقف

**EN:** Stop on wrong account/academy, missing permission or business approval, invalid/missing record, stale quote, blocked state, physical/clinical safety concern, unverified external money, duplicate reference, unavailable stock, capacity conflict or failed server validation as relevant. Specific control: Fresh quote; holds are not confirmed; paid cancellation needs reconciliation; credits restore only once. Preserve state/evidence and escalate; do not bypass API or change dates to evade locks.

**AR:** شروط التوقف: أوقف التنفيذ عند اختيار حساب أو أكاديمية خاطئة، أو نقص الصلاحيات أو الموافقة، أو تعارض الموارد، أو عدم التحقق من الأموال، أو انتهاء الصلاحية أو فشل تحقق الخادم أو وجود مخاطرة سلامة.


#### 10. Exceptions and corrections / الاستثناءات والتصحيح

**EN:** Refresh and recheck authoritative record and current deployment; investigate validation error rather than retrying blind. Correct only through authorised workflow with before/after evidence and separate approval where needed. Check duplicates, historical task lock, financial/credit ledger and linked stock/stall movements where relevant. Never use raw database edits or a demo reset as a workaround.

**AR:** الاستثناءات والتصحيح: حدث العرض وتحقق من السجل المعتمد قبل إعادة المحاولة؛ استخدم مسار التصحيح المخول واحفظ أثر التعديل. لا تُعدل قاعدة البيانات مباشرة ولا تتجاوز قفل التاريخ أو تعيد ضبط البيانات التجريبية.


#### 11. Outputs and handover / المخرجات والتسليم

**EN:** Verified bookings record/result, recorded operator and time, affected IDs, updated linked state, any approved notification, and an identified follow-up owner for unresolved issues. Physical handover and financial settlement remain separate where applicable.

**AR:** المخرجات والتسليم: تحقق من حالة السجل والوقت والمنفذ والمعرفات والأرصدة أو المخزون أو السعة المرتبطة. عين مسؤول متابعة واضحاً لأي استثناء وأكمل التسليم المادي أو المالي بشكل منفصل عند الحاجة.


#### 12. Records, privacy and retention / السجلات والخصوصية والاحتفاظ